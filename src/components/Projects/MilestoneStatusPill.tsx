import { getEnumDisplayName } from '../../helpers'
import { ProjectMilestoneStatus } from '../../types/projects.ts'
import Pill, { PillColor } from '../Common/Pill'

type Props = {
  status: ProjectMilestoneStatus
}

const ColorsConfig: Record<ProjectMilestoneStatus, PillColor> = {
  [ProjectMilestoneStatus.Pending]: PillColor.Gray,
  [ProjectMilestoneStatus.InProgress]: PillColor.Yellow,
  [ProjectMilestoneStatus.Done]: PillColor.Green,
}

export default function MilestoneStatusPill({ status }: Props) {
  return (
    <Pill size="sm" style="light" color={ColorsConfig[status]}>
      {getEnumDisplayName(status)}
    </Pill>
  )
}
