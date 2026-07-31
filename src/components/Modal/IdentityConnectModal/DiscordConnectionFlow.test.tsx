/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import DiscordConnectionFlow from './DiscordConnectionFlow.tsx'

const ADDRESS = '0x2AC89522CB415AC333E64F52a1a5693218cEBD58'

jest.mock('../../../hooks/useDiscordConnect.ts', () => {
  const connect = {
    getSignedMessage: jest.fn(),
    copyMessageToClipboard: jest.fn(),
    openChannel: jest.fn(),
    time: 299,
    isValidated: undefined as boolean | undefined,
    reset: jest.fn(),
  }
  return { __esModule: true, default: () => connect, __connect: connect }
})

// Returning the key keeps assertions readable: a button's accessible name is its label key.
jest.mock('../../../hooks/useFormatMessage.ts', () => ({
  __esModule: true,
  default: () => (key?: string) => key ?? '',
}))

jest.mock('../../../hooks/useAnalyticsTrack.ts', () => {
  const track = jest.fn()
  return { __esModule: true, default: () => track, __track: track }
})

jest.mock('react-router-dom', () => {
  const navigate = jest.fn()
  return { ...jest.requireActual('react-router-dom'), useNavigate: () => navigate, __navigate: navigate }
})

// react-markdown is ESM only and jest does not transform node_modules, so the renderer is stubbed
// at its narrowest point rather than stubbing the component that uses it.
jest.mock('../../Common/Typography/Markdown', () => ({
  __esModule: true,
  default: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}))

const connectModule = jest.requireMock('../../../hooks/useDiscordConnect.ts') as {
  __connect: {
    getSignedMessage: jest.Mock
    copyMessageToClipboard: jest.Mock
    openChannel: jest.Mock
    reset: jest.Mock
    isValidated: boolean | undefined
    time: number
  }
}
const trackModule = jest.requireMock('../../../hooks/useAnalyticsTrack.ts') as { __track: jest.Mock }

const STEP_ONE = 'modal.identity_setup.discord.action_step_1'
const STEP_TWO = 'modal.identity_setup.discord.action_step_2'
const STEP_THREE = 'modal.identity_setup.discord.action_step_3'

describe('DiscordConnectionFlow', () => {
  let connect: typeof connectModule.__connect
  let onClose: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    connect = connectModule.__connect
    connect.isValidated = undefined
    connect.time = 299
    connect.getSignedMessage.mockResolvedValue('0xsignature')
    onClose = jest.fn()
  })

  describe('when the validation has not resolved yet', () => {
    beforeEach(() => {
      render(<DiscordConnectionFlow address={ADDRESS} onClose={onClose} />)
    })

    it('should offer the first step', () => {
      expect(screen.getByRole('button', { name: STEP_ONE })).toBeTruthy()
    })

    it('should not offer the later steps yet', () => {
      expect(screen.queryByRole('button', { name: STEP_TWO })).toBeNull()
    })
  })

  describe('when the first step is actioned', () => {
    beforeEach(async () => {
      render(<DiscordConnectionFlow address={ADDRESS} onClose={onClose} />)
      await userEvent.click(screen.getByRole('button', { name: STEP_ONE }))
    })

    it('should ask the wallet to sign the validation message', () => {
      expect(connect.getSignedMessage).toHaveBeenCalled()
    })

    it('should advance to the copy step', async () => {
      await waitFor(() => expect(screen.getByRole('button', { name: STEP_TWO })).toBeTruthy())
    })
  })

  describe('and signing is rejected', () => {
    beforeEach(async () => {
      jest.spyOn(console, 'error').mockImplementation(() => undefined)
      connect.getSignedMessage.mockRejectedValue(new Error('user rejected'))
      render(<DiscordConnectionFlow address={ADDRESS} onClose={onClose} />)
      await userEvent.click(screen.getByRole('button', { name: STEP_ONE }))
    })

    it('should stay on the first step', () => {
      expect(screen.queryByRole('button', { name: STEP_TWO })).toBeNull()
    })

    it('should not report the identity flow as started', () => {
      expect(trackModule.__track).not.toHaveBeenCalled()
    })
  })

  describe('and the copy step is actioned', () => {
    beforeEach(async () => {
      render(<DiscordConnectionFlow address={ADDRESS} onClose={onClose} />)
      await userEvent.click(screen.getByRole('button', { name: STEP_ONE }))
      await waitFor(() => screen.getByRole('button', { name: STEP_TWO }))
      await userEvent.click(screen.getByRole('button', { name: STEP_TWO }))
    })

    it('should copy the signed message', () => {
      expect(connect.copyMessageToClipboard).toHaveBeenCalled()
    })

    it('should advance to the channel step', async () => {
      await waitFor(() => expect(screen.getByRole('button', { name: STEP_THREE })).toBeTruthy())
    })
  })

  describe('and the channel step is actioned', () => {
    beforeEach(async () => {
      render(<DiscordConnectionFlow address={ADDRESS} onClose={onClose} />)
      await userEvent.click(screen.getByRole('button', { name: STEP_ONE }))
      await waitFor(() => screen.getByRole('button', { name: STEP_TWO }))
      await userEvent.click(screen.getByRole('button', { name: STEP_TWO }))
      await waitFor(() => screen.getByRole('button', { name: STEP_THREE }))
      await userEvent.click(screen.getByRole('button', { name: STEP_THREE }))
    })

    it('should open the verification channel and begin polling', () => {
      expect(connect.openChannel).toHaveBeenCalled()
    })
  })

  // Runs after the rejection case above, which sets step one's status to 'error'.
  describe('when the flow is opened again after an earlier attempt failed', () => {
    beforeEach(() => {
      render(<DiscordConnectionFlow address={ADDRESS} onClose={onClose} />)
    })

    it('should show the initial helper for the first step, not the previous error', () => {
      expect(screen.getByText('modal.identity_setup.discord.card_helper.step_1_initial')).toBeTruthy()
    })
  })

  describe('when the validation has succeeded', () => {
    beforeEach(() => {
      connect.isValidated = true
      render(<DiscordConnectionFlow address={ADDRESS} onClose={onClose} />)
    })

    it('should leave the step flow', () => {
      expect(screen.queryByRole('button', { name: STEP_ONE })).toBeNull()
    })
  })

  describe('when the validation has failed', () => {
    beforeEach(() => {
      connect.isValidated = false
      render(<DiscordConnectionFlow address={ADDRESS} onClose={onClose} />)
    })

    it('should leave the step flow', () => {
      expect(screen.queryByRole('button', { name: STEP_ONE })).toBeNull()
    })
  })
})
