import useProjectUpdates from '../../hooks/useProjectUpdates'
import { ProjectStatus } from '../../types/grants'
import { Project } from '../../types/proposals'
import { ProjectHealth, UpdateAttributes } from '../../types/updates'
import locations from '../../utils/locations'

import ProjectStatusCard from './ProjectStatusCard'

interface Props {
  project: Project
}

function prioritizedStatus(
  project: Project,
  update?: UpdateAttributes
): { status: ProjectStatus | ProjectHealth; date: Date; href?: string } {
  const { status: projectStatus, updated_at, created_at } = project

  const defaultStatus = { status: projectStatus, date: updated_at || created_at }

  if ([ProjectStatus.Finished, ProjectStatus.Revoked, ProjectStatus.Paused].includes(projectStatus)) {
    return defaultStatus
  }

  if (update?.health) {
    return { status: update.health, date: update.updated_at, href: locations.update(update.id) }
  }

  return defaultStatus
}

function ProjectStatusCardWrapper({ project }: Props) {
  const { publicUpdates } = useProjectUpdates(project.id)
  const latestUpdate = publicUpdates?.[0]
  const { status, date, href } = prioritizedStatus(project, latestUpdate)
  return <ProjectStatusCard status={status} date={date} href={href} />
}

export default ProjectStatusCardWrapper
