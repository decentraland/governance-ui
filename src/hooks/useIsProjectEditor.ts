import { useAuthContext } from '../context/AuthProvider'
import { ProjectStatus } from '../types/grants'
import { Project } from '../types/proposals'
import { isSameAddress } from '../utils/snapshot'

const NOT_EDITABLE_STATUS = new Set([ProjectStatus.Finished, ProjectStatus.Revoked])
export default function useIsProjectEditor(project?: Project | null) {
  const [account] = useAuthContext()
  const isEditor =
    !!project &&
    (isSameAddress(project.author, account) ||
      !!project.coauthors?.some((coauthor) => isSameAddress(coauthor, account)))
  const isEditable = !!project && !NOT_EDITABLE_STATUS.has(project.status)
  return {
    isEditor,
    isEditable,
  }
}
