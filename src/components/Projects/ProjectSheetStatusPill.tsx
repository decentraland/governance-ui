import classNames from 'classnames'

import useFormatMessage from '../../hooks/useFormatMessage.ts'
import { ProjectStatus } from '../../types/grants'
import { ProjectAttributes } from '../../types/proposals.ts'
import { getDaysBetweenDates } from '../../utils/date/getDaysBetweenDates.ts'

import './ProjectSheetStatusPill.css'

interface Props {
  project: ProjectAttributes
  hero?: boolean
}

function getPillTextData(status: ProjectStatus, created_at: Date, updated_at: Date | undefined) {
  switch (status) {
    case ProjectStatus.Pending:
      return {}
    case ProjectStatus.InProgress:
      return { days: getDaysBetweenDates(created_at, new Date()) }
    default:
      // TODO: Add vesting finish date
      return { days: updated_at ? getDaysBetweenDates(updated_at, new Date()) : undefined }
  }
}

export default function ProjectSheetStatusPill({ project, hero = false }: Props) {
  const { status, created_at, updated_at } = project
  const t = useFormatMessage()

  console.log('p', project)

  return (
    <div className={classNames(['ProjectSheetStatusPill', `ProjectSheetStatusPill--${status}${hero ? '--hero' : ''}`])}>
      {t(`project.sheet.status_pill.${status}`, getPillTextData(status, created_at, updated_at))}
    </div>
  )
}
