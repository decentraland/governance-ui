/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react'

import useForumConnect from './useForumConnect'

const ADDRESS = '0x2AC89522CB415AC333E64F52a1a5693218cEBD58'

// The global constants mock in jest.setup.ts only provides GOVERNANCE_API, and this hook builds
// THREAD_URL from DISCOURSE_API at import time.
jest.mock('../constants', () => ({
  GOVERNANCE_API: 'governance_api',
  DISCOURSE_API: 'https://forum.test.url/',
}))

jest.mock('../utils/validationPoller', () => {
  const stop = jest.fn()
  return {
    startValidationPoller: jest.fn(() => ({ stop })),
    __stop: stop,
  }
})

jest.mock('./useTimer', () => {
  const startTimer = jest.fn()
  const resetTimer = jest.fn()
  const state = { time: 299 }
  return {
    __esModule: true,
    default: () => ({ startTimer, resetTimer, time: state.time }),
    __state: state,
  }
})

jest.mock('./useAnalyticsTrack', () => {
  const track = jest.fn()
  return { __esModule: true, default: () => track }
})

jest.mock('./useClipboardCopy', () => {
  const handleCopy = jest.fn()
  return { __esModule: true, default: () => ({ handleCopy }) }
})

jest.mock('../context/AuthProvider', () => ({
  useAuthContext: () => [ADDRESS, { provider: {} }],
}))

jest.mock('../clients/Governance', () => {
  const validateForumProfile = jest.fn()
  return {
    Governance: { get: () => ({ validateForumProfile }) },
    __validateForumProfile: validateForumProfile,
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
const governanceModule = jest.requireMock('../clients/Governance') as { __validateForumProfile: jest.Mock }

describe('useForumConnect', () => {
  let startValidationPoller: jest.Mock
  let stop: jest.Mock

  beforeEach(() => {
    startValidationPoller = pollerModule.startValidationPoller
    stop = pollerModule.__stop
    startValidationPoller.mockClear()
    stop.mockClear()
  })

  describe('when the verification thread is opened', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useForumConnect())
      act(() => result.current.openThread())
    })

    it('should start polling for the validation', () => {
      expect(startValidationPoller).toHaveBeenCalledTimes(1)
    })
  })

  describe('and it is opened again while a check is already running', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useForumConnect())
      act(() => {
        result.current.openThread()
        result.current.openThread()
      })
    })

    it('should not start a second poller', () => {
      expect(startValidationPoller).toHaveBeenCalledTimes(1)
    })
  })

  describe('and the poller runs a check', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useForumConnect())
      act(() => result.current.openThread())
      await startValidationPoller.mock.calls[0][0].check()
    })

    it('should ask the api whether the forum profile is validated', () => {
      expect(governanceModule.__validateForumProfile).toHaveBeenCalled()
    })
  })

  describe('when the poller reports a successful validation', () => {
    let isValidated: boolean | undefined

    beforeEach(() => {
      const { result } = renderHook(() => useForumConnect())
      act(() => result.current.openThread())
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
      const { result } = renderHook(() => useForumConnect())
      act(() => result.current.openThread())
      act(() => startValidationPoller.mock.calls[0][0].onError())
      isValidated = result.current.isValidated
    })

    it('should mark the profile as not validated', () => {
      expect(isValidated).toBe(false)
    })
  })

  describe('when the component unmounts while polling', () => {
    beforeEach(() => {
      const { result, unmount } = renderHook(() => useForumConnect())
      act(() => result.current.openThread())
      unmount()
    })

    it('should stop the poller', () => {
      expect(stop).toHaveBeenCalled()
    })
  })
})
