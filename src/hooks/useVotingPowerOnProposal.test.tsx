/**
 * @jest-environment jsdom
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'

import { Governance } from '../clients/Governance'
import { VpDistribution } from '../types/SnapshotTypes'
import { ProposalAttributes } from '../types/proposals'

import { EMPTY_DISTRIBUTION, setNoVotingPowerOnProposal } from './useVotingPowerDistribution'
import useVotingPowerOnProposal from './useVotingPowerOnProposal'

const ADDRESS = '0x2AC89522CB415AC333E64F52a1a5693218cEBD58'
const PROPOSAL = {
  id: 'f2bb1b20-9d84-11ee-9c62-a54d5a8c4d32',
  snapshot_id: '0x90e4a1e493f2548bf1ba27a63cd45e0d1c8f36bb1693afc2a72b12574309b59d',
} as ProposalAttributes

jest.mock('../clients/Governance', () => {
  const governance = { getVpDistribution: jest.fn(), getVotesByProposalFromSnapshot: jest.fn() }
  return { Governance: { get: () => governance } }
})

const getVpDistribution = Governance.get().getVpDistribution as jest.Mock
const getVotesByProposalFromSnapshot = Governance.get().getVotesByProposalFromSnapshot as jest.Mock

function distribution(values: Partial<VpDistribution>): VpDistribution {
  return { ...EMPTY_DISTRIBUTION, ...values }
}

function renderUseVotingPowerOnProposal() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  const hook = renderHook(() => useVotingPowerOnProposal(ADDRESS, [], false, PROPOSAL), { wrapper })
  return { ...hook, queryClient }
}

async function renderLoaded() {
  const rendered = renderUseVotingPowerOnProposal()
  await waitFor(() => expect(rendered.result.current.isLoadingVp).toBe(false))
  await waitFor(() => expect(getVotesByProposalFromSnapshot).toHaveBeenCalled())
  return rendered
}

describe('useVotingPowerOnProposal', () => {
  beforeEach(() => {
    getVpDistribution.mockReset()
    getVotesByProposalFromSnapshot.mockReset().mockResolvedValue([])
  })

  it('asks for the VP at the proposal snapshot', async () => {
    getVpDistribution.mockResolvedValueOnce(distribution({ hasVotingPower: true, total: 10, own: 10 }))

    await renderLoaded()

    expect(getVpDistribution).toHaveBeenCalledWith(ADDRESS, PROPOSAL.snapshot_id)
  })

  describe('when the API says the address has no VP on the proposal', () => {
    it('does not let it vote and says it has none', async () => {
      getVpDistribution.mockResolvedValueOnce(distribution({ hasVotingPower: false }))

      const { result } = await renderLoaded()

      expect(result.current.canVote).toBe(false)
      expect(result.current.hasEnoughToVote).toBe(false)
      expect(result.current.isVpUnknown).toBe(false)
    })
  })

  describe('when the address has less than 1 VP, which the API floors to 0', () => {
    it('lets it vote, since Snapshot accepts any VP above 0', async () => {
      getVpDistribution.mockResolvedValueOnce(distribution({ hasVotingPower: true, total: 0, own: 0 }))

      const { result } = await renderLoaded()

      expect(result.current.canVote).toBe(true)
      expect(result.current.hasEnoughToVote).toBe(true)
    })
  })

  describe('when the API predates hasVotingPower', () => {
    it('lets an address with a floored 0 VP vote, without claiming it has none, since it may have 0.4', async () => {
      getVpDistribution.mockResolvedValueOnce(distribution({ total: 0, own: 0 }))

      const { result } = await renderLoaded()

      expect(result.current.canVote).toBe(true)
      expect(result.current.hasEnoughToVote).toBe(true)
      expect(result.current.isVpUnknown).toBe(true)
    })

    it('shows the floored VP when it is above 0', async () => {
      getVpDistribution.mockResolvedValueOnce(distribution({ total: 1, own: 1 }))

      const { result } = await renderLoaded()

      await waitFor(() => expect(result.current.isVpUnknown).toBe(false))
      expect(result.current.totalVpOnProposal).toBe(1)
      expect(result.current.hasEnoughToVote).toBe(true)
      expect(result.current.canVote).toBe(true)
    })
  })

  describe('when the VP request fails', () => {
    it('lets the address vote, without claiming any amount of VP or that it has none', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => undefined)
      getVpDistribution.mockRejectedValueOnce(new Error('HTTP error! status: 429'))

      const { result } = await renderLoaded()

      expect(result.current.canVote).toBe(true)
      expect(result.current.hasEnoughToVote).toBe(true)
      expect(result.current.isVpUnknown).toBe(true)
      jest.restoreAllMocks()
    })
  })

  describe('while the VP is loading', () => {
    it('does not block voting', () => {
      getVpDistribution.mockReturnValueOnce(new Promise(() => undefined))

      const { result } = renderUseVotingPowerOnProposal()

      expect(result.current.isLoadingVp).toBe(true)
      expect(result.current.canVote).toBe(true)
    })
  })

  describe('when Snapshot rejected a vote for having no VP', () => {
    it.each([
      ['the API predates hasVotingPower', () => getVpDistribution.mockResolvedValueOnce(distribution({ total: 0 }))],
      ['the VP request failed', () => getVpDistribution.mockRejectedValueOnce(new Error('HTTP error! status: 429'))],
    ])('stops the address from voting again even if %s', async (_, mockVpDistribution) => {
      jest.spyOn(console, 'error').mockImplementation(() => undefined)
      mockVpDistribution()
      const { result, queryClient } = await renderLoaded()
      expect(result.current.canVote).toBe(true)

      act(() => setNoVotingPowerOnProposal(queryClient, ADDRESS, PROPOSAL.snapshot_id))

      await waitFor(() => expect(result.current.canVote).toBe(false))
      expect(result.current.hasEnoughToVote).toBe(false)
      expect(result.current.isVpUnknown).toBe(false)
      jest.restoreAllMocks()
    })
  })
})
