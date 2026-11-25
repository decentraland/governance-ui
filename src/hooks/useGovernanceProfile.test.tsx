/**
 * @jest-environment jsdom
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'

import { APIError } from '../clients/API'
import { ErrorClient } from '../clients/ErrorClient'
import { Governance } from '../clients/Governance'

import useGovernanceProfile from './useGovernanceProfile'

const ADDRESS = '0x2AC89522CB415AC333E64F52a1a5693218cEBD58'

jest.mock('../clients/ErrorClient', () => ({ ErrorClient: { report: jest.fn() } }))
jest.mock('../clients/Governance', () => {
  const governance = { getUserProfile: jest.fn() }
  return { Governance: { get: () => governance } }
})
jest.mock('../context/AuthProvider.tsx', () => ({ useAuthContext: () => [ADDRESS] }))

const getUserProfile = Governance.get().getUserProfile as jest.Mock
const report = ErrorClient.report as jest.Mock

function renderUseGovernanceProfile() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return renderHook(() => useGovernanceProfile(ADDRESS), { wrapper })
}

describe('useGovernanceProfile', () => {
  beforeEach(() => {
    getUserProfile.mockReset()
    report.mockReset()
  })

  it.each([
    ['the browser could not reach the API', new TypeError('Failed to fetch')],
    ['the profile does not exist', new APIError(404, '{"ok":false}')],
    ['the address is rejected', new APIError(400, '{"ok":false}')],
  ])('does not report when %s', async (_, error) => {
    getUserProfile.mockRejectedValueOnce(error)

    const { result } = renderUseGovernanceProfile()

    await waitFor(() => expect(result.current.isLoadingGovernanceProfile).toBe(false))
    expect(result.current.profile).toBeNull()
    expect(report).not.toHaveBeenCalled()
  })

  it('reports any other failure with the error itself, so ErrorClient serializes and caps it', async () => {
    const error = new APIError(500, 'Internal Server Error')
    getUserProfile.mockRejectedValueOnce(error)

    const { result } = renderUseGovernanceProfile()

    await waitFor(() => expect(result.current.isLoadingGovernanceProfile).toBe(false))
    expect(report).toHaveBeenCalledWith(
      'Error getting governance profile',
      { error, address: ADDRESS, category: 'Profile' },
      { sign: true }
    )
  })
})
