import classNames from 'classnames'

import useFormatMessage from '../../hooks/useFormatMessage.ts'
import { ProjectStatus } from '../../types/grants'
import { Project, ProjectFunding } from '../../types/projects.ts'
import { getDaysBetweenDates } from '../../utils/date/getDaysBetweenDates.ts'

import './ProjectViewStatusPill.css'

interface Props {
  project: Project
  hero?: boolean
}

function getPillTextData(status: ProjectStatus, created_at: Date, funding?: ProjectFunding) {
  switch (status) {
    case ProjectStatus.InProgress:
      return { days: getDaysBetweenDates(created_at, new Date()) }
    case ProjectStatus.Finished:
      return {
        days: funding?.vesting ? getDaysBetweenDates(funding.vesting?.finish_at, new Date()) : undefined,
      }
    default:
      return {}
  }
}

export default function ProjectViewStatusPill({ project, hero = false }: Props) {
  const { status, created_at, funding } = project
  const t = useFormatMessage()

  const pillData = getPillTextData(status, created_at, funding)

  return (
    <div className={classNames(['ProjectViewStatusPill', `ProjectViewStatusPill--${status}${hero ? '--hero' : ''}`])}>
      {t(`project.status_pill.${status}`, pillData)}
    </div>
  )
}
