import classNames from 'classnames'

import { getEnumDisplayName } from '../../helpers'
import { ProjectStatus } from '../../types/grants'

import './ProjectSheetStatusPill.css'

interface Props {
  status: ProjectStatus
}

export default function ProjectSheetStatusPill({ status }: Props) {
  const displayedStatus = getEnumDisplayName(status)

  //TODO texts and styles for each status
  return (
    <div className={classNames(['ProjectStatusPill', `ProjectStatusPill--${status}`])}>
      {displayedStatus + ' FOR XX DAYS'}
    </div>
  )
}
