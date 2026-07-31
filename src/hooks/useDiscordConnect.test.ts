/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react'

import { AccountType } from '../types/users'

import useDiscordConnect from './useDiscordConnect'

const ADDRESS = '0x2AC89522CB415AC333E64F52a1a5693218cEBD58'

jest.mock('../utils/validationPoller', () => {
  const stop = jest.fn()
  return {
    startValidationPoller: jest.fn(() => ({ stop })),
    __stop: stop,
  }
})

// Timer state lives inside the factory so the identities stay stable across renders; an unstable
// startTimer/resetTimer would change the hook's callback deps on every render.
jest.mock('./useTimer', () => {
  const startTimer = jest.fn()
  const resetTimer = jest.fn()
  const state = { time: 299 }
  return {
    __esModule: true,
    default: () => ({ startTimer, resetTimer, time: state.time }),
    __state: state,
    __resetTimer: resetTimer,
  }
})

jest.mock('./useAnalyticsTrack', () => {
  const track = jest.fn()
  return { __esModule: true, default: () => track }
})

jest.mock('./useClipboardCopy', () => {
  const handleCopy = jest.fn()
  return { __esModule: true, default: () => ({ handleCopy }), __handleCopy: handleCopy }
})

jest.mock('../context/AuthProvider', () => {
  const state = { provider: {} as unknown }
  return { useAuthContext: () => [ADDRESS, state], __state: state }
})

jest.mock('../clients/Governance', () => {
  const getValidationMessage = jest.fn()
  const validateDiscordProfile = jest.fn()
  return {
    Governance: { get: () => ({ getValidationMessage, validateDiscordProfile }) },
    __getValidationMessage: getValidationMessage,
    __validateDiscordProfile: validateDiscordProfile,
  }
})

jest.mock('@ethersproject/providers', () => {
  const signMessage = jest.fn()
  return {
    Web3Provider: jest.fn(() => ({ getSigner: () => ({ signMessage }) })),
    __signMessage: signMessage,
  }
})

jest.mock('../helpers', () => ({
  ...jest.requireActual('../helpers'),
  openUrl: jest.fn(),
}))

const pollerModule = jest.requireMock('../utils/validationPoller') as {
  startValidationPoller: jest.Mock
  __stop: jest.Mock
}
const timerModule = jest.requireMock('./useTimer') as { __state: { time: number }; __resetTimer: jest.Mock }
const clipboardModule = jest.requireMock('./useClipboardCopy') as { __handleCopy: jest.Mock }
const authModule = jest.requireMock('../context/AuthProvider') as { __state: { provider: unknown } }
const governanceModule = jest.requireMock('../clients/Governance') as {
  __getValidationMessage: jest.Mock
  __validateDiscordProfile: jest.Mock
}
const providersModule = jest.requireMock('@ethersproject/providers') as { __signMessage: jest.Mock }

describe('useDiscordConnect', () => {
  let startValidationPoller: jest.Mock
  let stop: jest.Mock

  beforeEach(() => {
    startValidationPoller = pollerModule.startValidationPoller
    stop = pollerModule.__stop
    jest.clearAllMocks()
    timerModule.__state.time = 299
    authModule.__state.provider = {}
  })

  describe('when the verification channel is opened', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useDiscordConnect())
      act(() => result.current.openChannel())
    })

    it('should start polling for the validation', () => {
      expect(startValidationPoller).toHaveBeenCalledTimes(1)
    })
  })

  describe('and it is opened again while a check is already running', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useDiscordConnect())
      act(() => {
        result.current.openChannel()
        result.current.openChannel()
      })
    })

    it('should not start a second poller', () => {
      expect(startValidationPoller).toHaveBeenCalledTimes(1)
    })
  })

  describe('and the poller runs a check', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useDiscordConnect())
      act(() => result.current.openChannel())
      await startValidationPoller.mock.calls[0][0].check()
    })

    it('should ask the api whether the discord profile is validated', () => {
      expect(governanceModule.__validateDiscordProfile).toHaveBeenCalled()
    })
  })

  // Otherwise the poller outlives the component and keeps issuing signed requests.
  describe('when the component unmounts while polling', () => {
    beforeEach(() => {
      const { result, unmount } = renderHook(() => useDiscordConnect())
      act(() => result.current.openChannel())
      unmount()
    })

    it('should stop the poller', () => {
      expect(stop).toHaveBeenCalled()
    })
  })

  describe('when the component unmounts without having polled', () => {
    let unmounting: () => void

    beforeEach(() => {
      const { unmount } = renderHook(() => useDiscordConnect())
      unmounting = unmount
    })

    it('should unmount cleanly with nothing to stop', () => {
      expect(unmounting).not.toThrow()
    })
  })

  describe('when the validation is reset without having polled', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useDiscordConnect())
      act(() => result.current.reset())
    })

    it('should have nothing to stop', () => {
      expect(stop).not.toHaveBeenCalled()
    })
  })

  describe('when a copy is requested before anything has been signed', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useDiscordConnect())
      act(() => result.current.copyMessageToClipboard())
    })

    it('should not copy an empty message', () => {
      expect(clipboardModule.__handleCopy).not.toHaveBeenCalled()
    })
  })

  describe('when the validation window runs out while polling', () => {
    beforeEach(() => {
      const { result, rerender } = renderHook(() => useDiscordConnect())
      act(() => result.current.openChannel())
      timerModule.__state.time = 0
      act(() => rerender())
    })

    it('should stop the poller', () => {
      expect(stop).toHaveBeenCalled()
    })
  })

  describe('when the validation is reset while polling', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useDiscordConnect())
      act(() => result.current.openChannel())
      act(() => result.current.reset())
    })

    it('should stop the poller', () => {
      expect(stop).toHaveBeenCalled()
    })
  })

  describe('when the poller reports a successful validation', () => {
    let isValidated: boolean | undefined

    beforeEach(() => {
      const { result } = renderHook(() => useDiscordConnect())
      act(() => result.current.openChannel())
      act(() => startValidationPoller.mock.calls[0][0].onValid())
      isValidated = result.current.isValidated
    })

    it('should mark the profile as validated', () => {
      expect(isValidated).toBe(true)
    })
  })

  describe('when the poller reports a failed validation', () => {
    let isValidated: boolean | undefined

    beforeEach(() => {
      const { result } = renderHook(() => useDiscordConnect())
      act(() => result.current.openChannel())
      act(() => startValidationPoller.mock.calls[0][0].onError())
      isValidated = result.current.isValidated
    })

    it('should mark the profile as not validated', () => {
      expect(isValidated).toBe(false)
    })
  })

  describe('when a message is requested for signing', () => {
    let signed: string | undefined

    beforeEach(async () => {
      governanceModule.__getValidationMessage.mockResolvedValue('message-to-sign')
      providersModule.__signMessage.mockResolvedValue('0xsignature')
      const { result } = renderHook(() => useDiscordConnect())
      await act(async () => {
        signed = await result.current.getSignedMessage()
      })
    })

    it('should ask for a message scoped to the discord account', () => {
      expect(governanceModule.__getValidationMessage).toHaveBeenCalledWith(AccountType.Discord)
    })

    it('should return the wallet signature', () => {
      expect(signed).toBe('0xsignature')
    })
  })

  describe('and the signed message is copied', () => {
    beforeEach(async () => {
      governanceModule.__getValidationMessage.mockResolvedValue('message-to-sign')
      providersModule.__signMessage.mockResolvedValue('0xsignature')
      const { result } = renderHook(() => useDiscordConnect())
      await act(async () => {
        await result.current.getSignedMessage()
      })
      act(() => result.current.copyMessageToClipboard())
    })

    it('should copy the message together with its signature', () => {
      expect(clipboardModule.__handleCopy).toHaveBeenCalledWith('message-to-sign\nSignature: 0xsignature')
    })
  })

  describe('and the wallet has no provider', () => {
    let signed: string | undefined

    beforeEach(async () => {
      authModule.__state.provider = undefined
      const { result } = renderHook(() => useDiscordConnect())
      await act(async () => {
        signed = await result.current.getSignedMessage()
      })
    })

    it('should not request a message at all', () => {
      expect(governanceModule.__getValidationMessage).not.toHaveBeenCalled()
      expect(signed).toBeUndefined()
    })
  })

  describe('and the api returns no message to sign', () => {
    let thrown: Error

    beforeEach(async () => {
      governanceModule.__getValidationMessage.mockResolvedValue(undefined)
      const { result } = renderHook(() => useDiscordConnect())
      await act(async () => {
        thrown = (await result.current.getSignedMessage().catch((error: Error) => error)) as Error
      })
    })

    it('should report that there is no message', () => {
      expect(thrown.message).toBe('No message')
    })
  })

  describe('and the wallet returns no signature', () => {
    let thrown: Error

    beforeEach(async () => {
      governanceModule.__getValidationMessage.mockResolvedValue('message-to-sign')
      providersModule.__signMessage.mockResolvedValue('')
      const { result } = renderHook(() => useDiscordConnect())
      await act(async () => {
        thrown = (await result.current.getSignedMessage().catch((error: Error) => error)) as Error
      })
    })

    it('should report that signing failed', () => {
      expect(thrown.message).toBe('Failed to sign message')
    })

    it('should reset the countdown it had started', () => {
      expect(timerModule.__resetTimer).toHaveBeenCalled()
    })
  })
})
