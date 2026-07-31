export type ValidationPoller = {
  stop: () => void
}

type StartValidationPollerOptions = {
  check: () => Promise<{ valid: boolean }>
  onValid: () => void
  onError: () => void
  intervalMs: number
}

/**
 * Polls a validation check until it succeeds, fails, or is stopped.
 *
 * Only the first outcome settles the poll. Checks never overlap, preventing slow requests from
 * accumulating while preserving the interval cadence once each request completes. Stopping also
 * suppresses an outcome arriving after unmount.
 */
export function startValidationPoller({
  check,
  onValid,
  onError,
  intervalMs,
}: StartValidationPollerOptions): ValidationPoller {
  let settled = false
  let inFlight = false

  const timer = setInterval(async () => {
    // Defensive: settling clears the interval, and an unresolved check owns the current poll slot.
    if (settled || inFlight) {
      return
    }

    inFlight = true
    try {
      const { valid } = await check()
      if (settled || !valid) {
        return
      }
      settled = true
      clearInterval(timer)
      onValid()
    } catch (error) {
      if (settled) {
        return
      }
      settled = true
      clearInterval(timer)
      onError()
    } finally {
      inFlight = false
    }
  }, intervalMs)

  return {
    stop: () => {
      settled = true
      clearInterval(timer)
    },
  }
}
