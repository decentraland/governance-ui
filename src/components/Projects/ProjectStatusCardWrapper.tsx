import useProjectUpdates from '../../hooks/useProjectUpdates'
import { ProjectStatus } from '../../types/grants'
import { Project } from '../../types/proposals'
import { ProjectHealth, UpdateAttributes } from '../../types/updates'
import locations from '../../utils/locations'

import ProjectHealthCard from './ProjectHealthCard.tsx'
import ProjectStatusCard from './ProjectStatusCard'

interface Props {
  project: Project
}

function prioritizedStatus(
  project: Project,
  update?: UpdateAttributes
): { status: ProjectStatus | ProjectHealth; date?: Date; href?: string } {
  const { status, created_at } = project

  const defaultStatus = { status, date: created_at }
  const priorityProjectStatuses = [ProjectStatus.Finished, ProjectStatus.Revoked, ProjectStatus.Paused]

  if (priorityProjectStatuses.includes(status)) {
    return { status, date: update?.updated_at }
  }

  if (update?.health) {
    return { status: update.health, date: update.updated_at, href: locations.update(update.id) }
  }

  return defaultStatus
}

function ProjectStatusCardWrapper({ project }: Props) {
  const { latestPublishedUpdate } = useProjectUpdates(project.id)
  const { status, date, href } = prioritizedStatus(project, latestPublishedUpdate)
  const isProjectHealth = date && href
  return isProjectHealth ? (
    <ProjectHealthCard status={status as ProjectHealth} date={date} href={href} />
  ) : (
    <ProjectStatusCard status={status as ProjectStatus} />
  )
}

export default ProjectStatusCardWrapper
