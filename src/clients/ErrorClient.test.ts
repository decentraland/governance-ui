import { ErrorClient } from './ErrorClient'

const mockReportErrorToServer = jest.fn()

jest.mock('./Governance', () => ({
  Governance: { get: () => ({ reportErrorToServer: mockReportErrorToServer }) },
}))

describe('ErrorClient.report', () => {
  beforeEach(() => {
    mockReportErrorToServer.mockReset()
  })

  it('sends errors serialized instead of as {}', async () => {
    await ErrorClient.report('Unable to vote', { error: new Error('Thirdweb: No active session'), category: 'Voting' })

    expect(mockReportErrorToServer).toHaveBeenCalledWith(
      'Unable to vote',
      {
        error: { name: 'Error', message: 'Thirdweb: No active session', stack: expect.any(String) },
        category: 'Voting',
      },
      undefined
    )
  })

  it('forwards the signing options', async () => {
    await ErrorClient.report('Error getting governance profile', { error: 'APIError: 500' }, { sign: false })

    expect(mockReportErrorToServer).toHaveBeenCalledWith(
      'Error getting governance profile',
      { error: 'APIError: 500' },
      { sign: false }
    )
  })

  it('swallows failures while reporting', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    mockReportErrorToServer.mockRejectedValueOnce(new Error('Missing identity'))

    await expect(ErrorClient.report('Unable to vote', { error: 'boom' })).resolves.toBeUndefined()
    expect(consoleError).toHaveBeenCalledWith('Error reporting error', expect.any(Error))

    consoleError.mockRestore()
  })
})
