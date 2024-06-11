import { useQuery } from '@tanstack/react-query'

import { Governance } from '../clients/Governance.ts'
import { SNAPSHOT_SPACE } from '../constants/snapshot'
import { EMPTY_DELEGATION } from '../types/SnapshotTypes'

import { DEFAULT_QUERY_STALE_TIME } from './constants'

export default function useDelegation(address?: string | null) {
  const { data: delegation, isLoading: isDelegationLoading } = useQuery({
    queryKey: ['delegations', SNAPSHOT_SPACE, address],
    queryFn: async () => {
      if (!address) return EMPTY_DELEGATION
      return await Governance.get().getDelegations(address)
    },
    staleTime: DEFAULT_QUERY_STALE_TIME,
  })
  return {
    delegation: delegation ?? EMPTY_DELEGATION,
    isDelegationLoading,
  }
}
