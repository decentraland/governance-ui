import useFormatMessage from '../../hooks/useFormatMessage.ts'
import { ProjectStatus } from '../../types/grants'
import Pill, { PillColor } from '../Common/Pill'

interface Props {
  status: ProjectStatus
}

const STATUS_COLORS: Record<ProjectStatus, PillColor> = {
  [ProjectStatus.InProgress]: PillColor.Green,
  [ProjectStatus.Finished]: PillColor.Green,
  [ProjectStatus.Revoked]: PillColor.Red,
  [ProjectStatus.Paused]: PillColor.Gray,
  [ProjectStatus.Pending]: PillColor.Gray,
}

export const PROJECT_STATUS_KEYS: Record<ProjectStatus | string, string> = {
  [ProjectStatus.Pending]: 'project_status.pending',
  [ProjectStatus.InProgress]: 'project_status.in_progress',
  [ProjectStatus.Finished]: 'project_status.finished',
  [ProjectStatus.Paused]: 'project_status.paused',
  [ProjectStatus.Revoked]: 'project_status.revoked',
}

export default function ProjectStatusPill({ status }: Props) {
  const t = useFormatMessage()
  const style = status === ProjectStatus.InProgress ? 'outline' : 'shiny'

  return (
    <Pill size="sm" color={STATUS_COLORS[status]} style={style}>
      {t(PROJECT_STATUS_KEYS[status])}
    </Pill>
  )
}
