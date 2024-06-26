import { useQuery } from '@tanstack/react-query'

import { Governance } from '../clients/Governance'

import { DEFAULT_QUERY_STALE_TIME } from './constants'

export function getProjectQueryKey(projectId?: string | null) {
  return ['project', projectId]
}

export default function useProject(projectId?: string | null) {
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: getProjectQueryKey(projectId),
    queryFn: async () => {
      if (!projectId) {
        return null
      }
      return Governance.get().getProject(projectId)
    },
    staleTime: DEFAULT_QUERY_STALE_TIME,
  })

  return {
    project,
    isLoadingProject,
  }
}
