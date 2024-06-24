import { PROJECT_UPDATES_LATEST_CHECK } from '../localStorageKeys.ts'
import { Project } from '../types/proposals.ts'

import useIsProjectEditor from './useIsProjectEditor.ts'
import useProjectUpdates from './useProjectUpdates.ts'

const UPDATED_CTA_FEATURE_RELEASE_DATE = new Date('2023-06-26')

function getStoredDate(key: string): Date | null {
  const dateString = localStorage.getItem(key)
  if (dateString && dateString.length > 0) {
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      return date
    }
  }
  return null
}

export default function useShowProjectUpdatesCta(project?: Project | null) {
  const { isEditor } = useIsProjectEditor(project)
  const { hasPendingMandatoryUpdate, latestPublishedUpdate } = useProjectUpdates(project?.id)
  const now = new Date()
  const savedDate = getStoredDate(`${PROJECT_UPDATES_LATEST_CHECK}-${project?.id}`)
  const latestCheckToUpdatesTab = savedDate ? new Date(savedDate) : null
  const editorHasPendingMandatoryUpdates = isEditor && hasPendingMandatoryUpdate
  const newUpdateForNonEditors =
    !isEditor &&
    latestPublishedUpdate &&
    ((latestCheckToUpdatesTab && latestPublishedUpdate.updated_at > latestCheckToUpdatesTab) ||
      latestCheckToUpdatesTab === null) &&
    now > UPDATED_CTA_FEATURE_RELEASE_DATE

  return { showUpdatesCta: editorHasPendingMandatoryUpdates || newUpdateForNonEditors }
}
