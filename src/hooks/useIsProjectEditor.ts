import { useAuthContext } from '../context/AuthProvider'
import { Project } from '../types/proposals'
import { isSameAddress } from '../utils/snapshot'

export default function useIsProjectEditor(project: Project | null) {
  const [account] = useAuthContext()
  if (!project) return false
  return (
    isSameAddress(project.author, account) || !!project?.coauthors?.some((coauthor) => isSameAddress(coauthor, account))
  )
}
