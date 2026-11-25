import { QueryClient, useQuery } from '@tanstack/react-query'

import { Governance } from '../clients/Governance'
import { VpDistribution } from '../types/SnapshotTypes'

import { DEFAULT_QUERY_STALE_TIME } from './constants'

export const EMPTY_DISTRIBUTION: VpDistribution = {
  total: 0,
  own: 0,
  wMana: 0,
  land: 0,
  estate: 0,
  mana: 0,
  names: 0,
  delegated: 0,
  l1Wearables: 0,
  rental: 0,
}

function getVpDistributionQueryKey(address?: string | null, proposalSnapshotId?: string) {
  return [`vpDistribution#${address}#${proposalSnapshotId}`]
}

/**
 * Records that Snapshot rejected a vote from `address` on the proposal with "no voting power", so the voting section
 * shows that and disables voting even if the API couldn't tell (request failed, or an API without `hasVotingPower`).
 */
export function setNoVotingPowerOnProposal(queryClient: QueryClient, address: string, proposalSnapshotId: string) {
  queryClient.setQueryData<VpDistribution>(
    getVpDistributionQueryKey(address, proposalSnapshotId),
    (vpDistribution) => ({ ...(vpDistribution ?? EMPTY_DISTRIBUTION), hasVotingPower: false })
  )
}

export default function useVotingPowerDistribution(address?: string | null, proposalSnapshotId?: string) {
  const {
    data: vpDistribution,
    isLoading,
    isError,
  } = useQuery({
    queryKey: getVpDistributionQueryKey(address, proposalSnapshotId),
    queryFn: async () => {
      if (!address) return EMPTY_DISTRIBUTION
      return await Governance.get().getVpDistribution(address, proposalSnapshotId)
    },
    staleTime: DEFAULT_QUERY_STALE_TIME,
  })

  return {
    vpDistribution: vpDistribution ?? EMPTY_DISTRIBUTION,
    isLoadingVpDistribution: isLoading,
    isErrorVpDistribution: isError,
  }
}
