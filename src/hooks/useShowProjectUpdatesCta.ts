import { PROJECT_UPDATES_LATEST_CHECK } from '../localStorageKeys.ts'
import { Project } from '../types/proposals.ts'

import useIsProjectEditor from './useIsProjectEditor.ts'
import useProjectUpdates from './useProjectUpdates.ts'

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

  const savedDate = getStoredDate(`${PROJECT_UPDATES_LATEST_CHECK}-${project?.id}`)
  console.log('savedDate', savedDate)
  const latestCheckToUpdatesTab = savedDate ? new Date(savedDate) : null
  const editorHasPendingMandatoryUpdates = isEditor && hasPendingMandatoryUpdate
  const newUpdateForNonEditors =
    !isEditor &&
    latestPublishedUpdate &&
    ((latestCheckToUpdatesTab && latestPublishedUpdate.updated_at > latestCheckToUpdatesTab) ||
      latestCheckToUpdatesTab === null)

  console.log('editorHasPendingMandatoryUpdates', editorHasPendingMandatoryUpdates)
  console.log('newUpdateForNonEditors', newUpdateForNonEditors)
  return { showUpdatesCta: editorHasPendingMandatoryUpdates || newUpdateForNonEditors }
}
