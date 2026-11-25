import { ErrorCode, Logger } from '@ethersproject/logger'

import {
  isBrowserNetworkError,
  isExpectedVoteError,
  isSnapshotNoVotingPowerError,
  isUserRejectedError,
  serializeError,
  toErrorReportExtraInfo,
} from './errors'

const SNAPSHOT_NO_VP = { error: 'client_error', error_description: 'no voting power' }
const SNAPSHOT_PINNING_FAILED = { error: 'client_error', error_description: 'pinning failed' }

function makeEthersRejection() {
  return new Logger('providers/5.8.0').makeError('user rejected signing', ErrorCode.ACTION_REJECTED, {
    action: '_signTypedData',
  })
}

describe('serializeError', () => {
  it('keeps the name, message and stack that JSON.stringify drops', () => {
    const error = new TypeError('boom')

    expect(JSON.stringify(error)).toBe('{}')
    expect(serializeError(error)).toEqual({
      name: 'TypeError',
      message: 'boom',
      stack: expect.stringContaining('TypeError: boom'),
    })
  })

  it('keeps enumerable props such as ethers error fields', () => {
    expect(serializeError(makeEthersRejection())).toEqual(
      expect.objectContaining({
        name: 'Error',
        message: expect.stringContaining('user rejected signing'),
        code: ErrorCode.ACTION_REJECTED,
        reason: 'user rejected signing',
        action: '_signTypedData',
      })
    )
  })

  it('keeps a non-enumerable code and the cause', () => {
    const cause = new Error('inner')
    const error = new Error('outer')
    Object.defineProperty(error, 'code', { value: 'E_OUTER', enumerable: false })
    Object.defineProperty(error, 'cause', { value: cause, enumerable: false })

    expect(serializeError(error)).toEqual(expect.objectContaining({ code: 'E_OUTER', cause }))
  })

  it('trims the stack to the first 10 lines', () => {
    const error = new Error('deep')
    error.stack = ['Error: deep', ...Array.from({ length: 30 }, (_, i) => `    at frame${i} (app.js:1:${i})`)].join(
      '\n'
    )

    const { stack } = serializeError(error)

    expect(stack?.split('\n')).toHaveLength(10)
    expect(stack).toContain('frame0')
    expect(stack).not.toContain('frame9 ')
  })

  it('caps the message and the stack length', () => {
    const body = 'x'.repeat(5000)
    const error = new Error(`missing response (body=${body})`)
    error.stack = `Error: ${error.message}\n    at send (app.js:1:1)`

    const { message, stack } = serializeError(error)

    expect(message).toHaveLength(1000 + '… [truncated]'.length)
    expect(message.endsWith('… [truncated]')).toBe(true)
    expect(stack).toHaveLength(2000 + '… [truncated]'.length)
  })

  it('caps string props such as an APIError body', () => {
    const error = Object.assign(new Error('HTTP error! status: 502'), { status: 502, body: '<html>'.repeat(1000) })

    const serialized = serializeError(error)

    expect(serialized.status).toBe(502)
    expect(serialized.body).toHaveLength(1000 + '… [truncated]'.length)
  })

  it('omits the stack when there is none', () => {
    const error = new Error('no stack')
    error.stack = undefined

    expect(serializeError(error)).not.toHaveProperty('stack')
  })
})

describe('toErrorReportExtraInfo', () => {
  it('returns undefined when there is no extra info', () => {
    expect(toErrorReportExtraInfo(undefined)).toBeUndefined()
    expect(toErrorReportExtraInfo(null)).toBeUndefined()
  })

  it('serializes an Error passed under a key instead of sending {}', () => {
    const result = toErrorReportExtraInfo({ error: new Error('Thirdweb: No active session'), category: 'Voting' })

    expect(result).toEqual({
      error: { name: 'Error', message: 'Thirdweb: No active session', stack: expect.any(String) },
      category: 'Voting',
    })
  })

  it('passes plain objects through unchanged, like the Snapshot error bodies', () => {
    const extraInfo = {
      error: SNAPSHOT_PINNING_FAILED,
      address: '0x9DAb43Bc15BD29Cfe3030cA1b7EDb3EEb9f3b6c1',
      proposal: '9ee62f19-7174-40cb-8beb-c0b1198638e5',
      category: 'Voting',
    }

    expect(toErrorReportExtraInfo(extraInfo)).toEqual(extraInfo)
  })

  it('wraps an Error passed as the whole extra info under `error`', () => {
    expect(toErrorReportExtraInfo(new Error('Error getting provider'))).toEqual({
      error: { name: 'Error', message: 'Error getting provider', stack: expect.any(String) },
    })
  })

  it('wraps values that are not plain objects under `error`', () => {
    expect(toErrorReportExtraInfo('something broke')).toEqual({ error: 'something broke' })
    expect(toErrorReportExtraInfo([1, 2])).toEqual({ error: [1, 2] })
  })

  it('serializes nested errors such as a cause or an ethers wrapped error', () => {
    const inner = new Error('inner')
    const outer = new Error('outer')
    Object.defineProperty(outer, 'cause', { value: inner, enumerable: false })

    const result = toErrorReportExtraInfo({ error: outer, wrapper: { error: inner } })

    expect(result).toEqual({
      error: expect.objectContaining({ message: 'outer', cause: expect.objectContaining({ message: 'inner' }) }),
      wrapper: { error: expect.objectContaining({ message: 'inner' }) },
    })
  })

  it('cuts a cycle instead of recursing forever when an error references itself', () => {
    const error = new Error('loop')
    Object.defineProperty(error, 'cause', { value: error, enumerable: false })

    expect(toErrorReportExtraInfo({ error })).toEqual({
      error: expect.objectContaining({ message: 'loop', cause: '[Circular]' }),
    })
  })

  it('cuts a cycle in plain objects instead of throwing like JSON.stringify would', () => {
    const extraInfo: Record<string, unknown> = { category: 'Voting' }
    extraInfo.self = extraInfo

    expect(toErrorReportExtraInfo(extraInfo)).toEqual({ category: 'Voting', self: '[Circular]' })
  })

  it('turns bigints into strings so JSON.stringify does not throw and drop the report', () => {
    const result = toErrorReportExtraInfo({
      error: Object.assign(new Error('tx failed'), { value: BigInt('1000000000000000000') }),
    })

    expect(result).toEqual({ error: expect.objectContaining({ value: '1000000000000000000' }) })
    expect(() => JSON.stringify(result)).not.toThrow()
  })

  it('leaves class instances such as dates for JSON.stringify', () => {
    const date = new Date('2026-11-25T00:00:00Z')

    expect(toErrorReportExtraInfo({ date })).toEqual({ date })
  })
})

describe('isUserRejectedError', () => {
  it.each([
    ['ethers ACTION_REJECTED', makeEthersRejection()],
    ['an EIP-1193 4001 error', { code: 4001, message: 'User rejected the request.' }],
    ['a 4001 code with an unrelated message', { code: 4001, message: 'Something else' }],
    ['a plain Error with a rejection message', new Error('User rejected.')],
    ['MetaMask denial message', new Error('MetaMask Message Signature: User denied message signature.')],
    ['a cancellation message', new Error('User canceled')],
    ['a "rejected by user" message', new Error('Request rejected by the user')],
    ['a rejection wrapped in `error`', { code: -32603, error: { code: 4001 } }],
    ['a rejection wrapped in `cause`', { message: 'Signing failed', cause: { code: ErrorCode.ACTION_REJECTED } }],
  ])('returns true for %s', (_, error) => {
    expect(isUserRejectedError(error)).toBe(true)
  })

  it.each([
    ['undefined', undefined],
    ['a string', 'User rejected'],
    ['a generic Error', new Error('Failed to fetch')],
    ['the Snapshot no voting power body', SNAPSHOT_NO_VP],
    ['the Snapshot pinning failed body', SNAPSHOT_PINNING_FAILED],
    ['a different provider code', { code: 4100, message: 'Unauthorized' }],
  ])('returns false for %s', (_, error) => {
    expect(isUserRejectedError(error)).toBe(false)
  })
})

describe('isSnapshotNoVotingPowerError', () => {
  it('returns true for the Snapshot no voting power body', () => {
    expect(isSnapshotNoVotingPowerError(SNAPSHOT_NO_VP)).toBe(true)
  })

  it.each([
    ['the Snapshot pinning failed body', SNAPSHOT_PINNING_FAILED],
    ['an Error with the same text', new Error('no voting power')],
    ['undefined', undefined],
    ['a string', 'no voting power'],
  ])('returns false for %s', (_, error) => {
    expect(isSnapshotNoVotingPowerError(error)).toBe(false)
  })
})

describe('isExpectedVoteError', () => {
  it.each([
    ['a wallet rejection', { code: 4001, message: 'User rejected the request.' }],
    ['the Snapshot no voting power body', SNAPSHOT_NO_VP],
  ])('returns true for %s', (_, error) => {
    expect(isExpectedVoteError(error)).toBe(true)
  })

  it.each([
    ['the Snapshot pinning failed body', SNAPSHOT_PINNING_FAILED],
    ['an unexpected Error', new Error('Thirdweb: No active session')],
  ])('returns false for %s, which is still reported', (_, error) => {
    expect(isExpectedVoteError(error)).toBe(false)
  })
})

describe('isBrowserNetworkError', () => {
  it.each([
    ['Chrome', 'Failed to fetch'],
    ['Firefox', 'NetworkError when attempting to fetch resource.'],
    ['Safari', 'Load failed'],
  ])('returns true for the %s TypeError', (_, message) => {
    expect(isBrowserNetworkError(new TypeError(message))).toBe(true)
  })

  it.each([
    ['a plain Error with the same message', new Error('Failed to fetch')],
    ['a TypeError from a bug', new TypeError("Cannot read properties of undefined (reading 'id')")],
    ['a message that only contains the text', new TypeError('Failed to fetch user profile')],
    ['the stringified TypeError', 'TypeError: Failed to fetch'],
    ['undefined', undefined],
    ['the Snapshot pinning failed body', SNAPSHOT_PINNING_FAILED],
  ])('returns false for %s', (_, error) => {
    expect(isBrowserNetworkError(error)).toBe(false)
  })
})
