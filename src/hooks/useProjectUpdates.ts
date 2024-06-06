import { useQuery } from '@tanstack/react-query'

import { Governance } from '../clients/Governance'
import { UpdateResponse } from '../types/updates'

import { DEFAULT_QUERY_STALE_TIME } from './constants'

export default function useProjectUpdates(projectId?: string | null) {
  const {
    data: updates,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['projectUpdates', projectId],
    queryFn: async () => {
      if (!projectId) {
        return {} as UpdateResponse
      }
      return Governance.get().getProjectUpdates(projectId)
    },
    staleTime: DEFAULT_QUERY_STALE_TIME,
  })

  return {
    publicUpdates: updates?.publicUpdates,
    pendingUpdates: updates?.pendingUpdates,
    nextUpdate: updates?.nextUpdate,
    currentUpdate: updates?.currentUpdate,
    isLoading,
    isError,
    refetchUpdates: refetch,
  }
}
