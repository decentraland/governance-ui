import { ValidationPoller, startValidationPoller } from './validationPoller'

const INTERVAL = 10000

type Deferred<T> = {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (reason: unknown) => void
}

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

// The poll callback awaits the check, so its continuation runs on the microtask queue.
async function flush() {
  await Promise.resolve()
  await Promise.resolve()
}

describe('startValidationPoller', () => {
  let check: jest.Mock
  let onValid: jest.Mock
  let onError: jest.Mock
  let poller: ValidationPoller

  beforeEach(() => {
    jest.useFakeTimers()
    onValid = jest.fn()
    onError = jest.fn()
  })

  afterEach(() => {
    poller.stop()
    jest.useRealTimers()
  })

  describe('when the check reports the profile is not valid yet', () => {
    beforeEach(async () => {
      check = jest.fn().mockResolvedValue({ valid: false })
      poller = startValidationPoller({ check, onValid, onError, intervalMs: INTERVAL })
      await jest.advanceTimersByTimeAsync(INTERVAL * 3)
    })

    it('should keep checking on every interval', () => {
      expect(check).toHaveBeenCalledTimes(3)
    })

    it('should not report an outcome', () => {
      expect(onValid).not.toHaveBeenCalled()
      expect(onError).not.toHaveBeenCalled()
    })
  })

  describe('when the check reports the profile as valid', () => {
    beforeEach(async () => {
      check = jest.fn().mockResolvedValue({ valid: true })
      poller = startValidationPoller({ check, onValid, onError, intervalMs: INTERVAL })
      await jest.advanceTimersByTimeAsync(INTERVAL)
    })

    it('should report the success once', () => {
      expect(onValid).toHaveBeenCalledTimes(1)
    })

    it('should stop checking', async () => {
      await jest.advanceTimersByTimeAsync(INTERVAL * 3)
      expect(check).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the check fails', () => {
    beforeEach(async () => {
      check = jest.fn().mockRejectedValue(new Error('Validation timed out'))
      poller = startValidationPoller({ check, onValid, onError, intervalMs: INTERVAL })
      await jest.advanceTimersByTimeAsync(INTERVAL)
    })

    it('should report the failure once', () => {
      expect(onError).toHaveBeenCalledTimes(1)
    })

    it('should stop checking', async () => {
      await jest.advanceTimersByTimeAsync(INTERVAL * 3)
      expect(check).toHaveBeenCalledTimes(1)
    })
  })

  describe('when a check is still in flight at the next interval', () => {
    let slow: Deferred<{ valid: boolean }>

    beforeEach(async () => {
      slow = deferred<{ valid: boolean }>()
      check = jest.fn().mockReturnValueOnce(slow.promise).mockResolvedValue({ valid: false })
      poller = startValidationPoller({ check, onValid, onError, intervalMs: INTERVAL })

      await jest.advanceTimersByTimeAsync(INTERVAL)
      await jest.advanceTimersByTimeAsync(INTERVAL)
    })

    it('should not start an overlapping check', () => {
      expect(check).toHaveBeenCalledTimes(1)
    })

    describe('and the slow check completes', () => {
      beforeEach(async () => {
        slow.resolve({ valid: false })
        await flush()
        await jest.advanceTimersByTimeAsync(INTERVAL)
      })

      it('should resume checking on the next interval', () => {
        expect(check).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('when it is stopped while a check is in flight', () => {
    beforeEach(async () => {
      const inFlight = deferred<{ valid: boolean }>()
      check = jest.fn().mockReturnValueOnce(inFlight.promise)
      poller = startValidationPoller({ check, onValid, onError, intervalMs: INTERVAL })

      await jest.advanceTimersByTimeAsync(INTERVAL)
      poller.stop()
      inFlight.resolve({ valid: true })
      await flush()
    })

    it('should not report the result that arrived after stopping', () => {
      expect(onValid).not.toHaveBeenCalled()
    })
  })

  describe('when it is stopped before the first interval elapses', () => {
    beforeEach(async () => {
      check = jest.fn().mockResolvedValue({ valid: true })
      poller = startValidationPoller({ check, onValid, onError, intervalMs: INTERVAL })
      poller.stop()
      await jest.advanceTimersByTimeAsync(INTERVAL * 3)
    })

    it('should never check', () => {
      expect(check).not.toHaveBeenCalled()
    })
  })
})
