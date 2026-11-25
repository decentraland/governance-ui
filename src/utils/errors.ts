import { ErrorCode } from '@ethersproject/logger'

const MAX_STACK_LINES = 10
// ethers repeats its params (e.g. an RPC response body) in the message, and the stack's first line repeats the message
const MAX_MESSAGE_LENGTH = 1000
const MAX_STACK_LENGTH = 2000
const MAX_NESTED_ERROR_DEPTH = 3

// EIP-1193 "User Rejected Request". Wallets that don't go through ethers' ACTION_REJECTED mapping throw this raw.
const EIP1193_USER_REJECTED_CODE = 4001
const USER_REJECTED_MESSAGE = /\buser (rejected|denied|cancell?ed)\b|\b(rejected|denied|cancell?ed) by (the )?user\b/i

const SNAPSHOT_NO_VOTING_POWER = 'no voting power'

// What fetch() rejects with when the request gets no response (offline, aborted navigation, blocked by an extension):
// Chrome, Firefox and Safari, in that order.
const BROWSER_NETWORK_ERROR_MESSAGES = new Set([
  'Failed to fetch',
  'NetworkError when attempting to fetch resource.',
  'Load failed',
])

export type SerializedError = {
  name: string
  message: string
  code?: unknown
  stack?: string
  cause?: unknown
  [key: string]: unknown
}

function truncate(text: string, maxLength: number) {
  return text.length > maxLength ? `${text.slice(0, maxLength)}… [truncated]` : text
}

function trimStack(stack: string) {
  return truncate(stack.split('\n').slice(0, MAX_STACK_LINES).join('\n'), MAX_STACK_LENGTH)
}

/**
 * JSON.stringify(new Error('boom')) is '{}' because name, message and stack are not enumerable.
 * This keeps the enumerable props that would have been sent anyway (e.g. ethers' `reason`, `code`, `action`)
 * and adds the non-enumerable ones that make the report useful.
 */
export function serializeError(error: Error): SerializedError {
  const { code, cause } = error as Error & { code?: unknown; cause?: unknown }
  return {
    ...error,
    name: error.name,
    message: truncate(error.message, MAX_MESSAGE_LENGTH),
    ...(code !== undefined ? { code } : {}),
    ...(cause !== undefined ? { cause } : {}),
    ...(error.stack ? { stack: trimStack(error.stack) } : {}),
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') {
    return false
  }
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

// `ancestors` only holds the objects on the current path, so a value referenced twice is serialized twice and only a
// real cycle (e.g. an error whose `cause` is itself) is cut.
function serializeErrorsDeep(value: unknown, ancestors: Set<object>): unknown {
  const isError = value instanceof Error
  if (!isError && !Array.isArray(value) && !isPlainObject(value)) {
    // Primitives and class instances (Date, BigNumber...) are left for JSON.stringify, as before
    return value
  }
  if (ancestors.has(value)) {
    return '[Circular]'
  }

  ancestors.add(value)
  const source = isError ? serializeError(value) : value
  const serialized = Array.isArray(source)
    ? source.map((item) => serializeErrorsDeep(item, ancestors))
    : Object.fromEntries(Object.entries(source).map(([key, item]) => [key, serializeErrorsDeep(item, ancestors)]))
  ancestors.delete(value)

  return serialized
}

/**
 * Turns whatever a caller passed as extra info into the object the backend forwards to Rollbar:
 * Error values (at any depth) are serialized with `serializeError`, and anything that isn't a plain object
 * (an Error passed directly, a string, an array) is wrapped as `{ error: value }`. Other values are unchanged.
 */
export function toErrorReportExtraInfo(extraInfo: unknown): Record<string, unknown> | undefined {
  if (extraInfo === undefined || extraInfo === null) {
    return undefined
  }

  const payload = isPlainObject(extraInfo) ? extraInfo : { error: extraInfo }
  return serializeErrorsDeep(payload, new Set()) as Record<string, unknown>
}

/**
 * True when the user dismissed the wallet prompt. ethers only maps MetaMask's "User denied" message to
 * ACTION_REJECTED; other wallets reject with the raw EIP-1193 code, or only a message, sometimes wrapped
 * in `error` or `cause`.
 */
export function isUserRejectedError(error: unknown, depth = 0): boolean {
  if (!error || typeof error !== 'object' || depth > MAX_NESTED_ERROR_DEPTH) {
    return false
  }

  const { code, message, error: innerError, cause } = error as Record<string, unknown>
  if (code === ErrorCode.ACTION_REJECTED || code === EIP1193_USER_REJECTED_CODE) {
    return true
  }
  if (typeof message === 'string' && USER_REJECTED_MESSAGE.test(message)) {
    return true
  }

  return isUserRejectedError(innerError, depth + 1) || isUserRejectedError(cause, depth + 1)
}

/**
 * Snapshot's sequencer rejects a vote from an address with no voting power at the proposal's snapshot block with
 * `{ error: 'client_error', error_description: 'no voting power' }`.
 */
export function isSnapshotNoVotingPowerError(error: unknown): boolean {
  return (
    !!error &&
    typeof error === 'object' &&
    (error as Record<string, unknown>).error_description === SNAPSHOT_NO_VOTING_POWER
  )
}

/**
 * True for the TypeError fetch() throws when the request got no readable response. For a cross-origin request that
 * includes an error page served without CORS headers (e.g. a gateway 502), so only skip reports on it for our own
 * API, whose outages are visible on the backend, and not for third parties like Snapshot.
 */
export function isBrowserNetworkError(error: unknown): boolean {
  return error instanceof TypeError && BROWSER_NETWORK_ERROR_MESSAGES.has(error.message)
}
