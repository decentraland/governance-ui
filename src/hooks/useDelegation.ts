import { useQuery } from '@tanstack/react-query'

import { EMPTY_DELEGATION } from '../clients/SnapshotTypes'
import { SNAPSHOT_SPACE } from '../constants/snapshot'
import { getDelegations } from '../utils/snapshot'

import { DEFAULT_QUERY_STALE_TIME } from './constants'

export default function useDelegation(address?: string | null) {
  const { data: delegation, isLoading: isDelegationLoading } = useQuery({
    queryKey: [`delegations#${SNAPSHOT_SPACE}#${address}`],
    queryFn: async () => {
      if (!address) return EMPTY_DELEGATION
      return await getDelegations(address)
    },
    staleTime: DEFAULT_QUERY_STALE_TIME,
  })
  return {
    delegation: delegation ?? EMPTY_DELEGATION,
    isDelegationLoading,
  }
}
