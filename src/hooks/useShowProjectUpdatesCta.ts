import { PROJECT_UPDATES_LATEST_CHECK } from '../localStorageKeys.ts'
import { Project } from '../types/proposals.ts'
import Time from '../utils/date/Time.ts'

import useIsProjectEditor from './useIsProjectEditor.ts'
import useProjectUpdates from './useProjectUpdates.ts'

const UPDATED_CTA_FEATURE_RELEASE_DATE = Time('2024-06-25T00:00:00Z')

function getStoredTime(key: string): Time.Dayjs | null {
  const dateString = localStorage.getItem(key)
  if (dateString && dateString.length > 0) {
    const time = Time(dateString)
    if (time.isValid()) {
      return time
    }
  }
  return null
}

export default function useShowProjectUpdatesCta(project?: Project | null) {
  const { isEditor } = useIsProjectEditor(project)
  const { hasPendingMandatoryUpdate, latestPublishedUpdate } = useProjectUpdates(project?.id)
  const latestCheckToUpdatesTab = getStoredTime(`${PROJECT_UPDATES_LATEST_CHECK}-${project?.id}`)
  const editorHasPendingMandatoryUpdates = isEditor && hasPendingMandatoryUpdate
  const newUpdateForNonEditors =
    !isEditor &&
    !!latestPublishedUpdate &&
    ((!!latestCheckToUpdatesTab && latestCheckToUpdatesTab.isBefore(latestPublishedUpdate.updated_at)) ||
      (latestCheckToUpdatesTab === null && UPDATED_CTA_FEATURE_RELEASE_DATE.isBefore(latestPublishedUpdate.updated_at)))

  return { showUpdatesCta: editorHasPendingMandatoryUpdates || newUpdateForNonEditors }
}
