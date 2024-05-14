import { useQuery } from '@tanstack/react-query'

import { Governance } from '../clients/Governance'
import { ProjectStatus } from '../types/grants.ts'

import { DEFAULT_QUERY_STALE_TIME } from './constants'

export default function useProject(projectId?: string) {
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) {
        return null
      }
      let project1 = await Governance.get().getProject(projectId)
      project1 = { ...project1, status: ProjectStatus.Finished, updated_at: new Date('2024-05-05') }
      return project1
    },
    staleTime: DEFAULT_QUERY_STALE_TIME,
  })

  return {
    project,
    isLoadingProject,
  }
}
