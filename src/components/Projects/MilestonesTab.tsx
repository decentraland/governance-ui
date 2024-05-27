import { useMemo } from 'react'

import { ProjectMilestone } from '../../types/proposals'
import { BreakdownItem } from '../GrantRequest/BreakdownAccordion.tsx'

import EditableBreakdownContent from './EditableBreakdownContent.tsx'
import ExpandableBreakdownItem from './ExpandableBreakdownItem.tsx'
import MilestoneStatusPill from './MilestoneStatusPill.tsx'
import ProjectSidebarSectionTitle from './ProjectSidebarSectionTitle.tsx'

interface Props {
  milestones: ProjectMilestone[]
}

function Milestonesab({ milestones }: Props) {
  const items = useMemo(
    () =>
      milestones.map<BreakdownItem>(({ title, description, status }) => ({
        title,
        subtitle: <MilestoneStatusPill status={status} />,
        content: <EditableBreakdownContent about={description} onClick={() => {}} />,
      })),
    [milestones]
  )

  return (
    <div>
      <ProjectSidebarSectionTitle text={'Milestones'} />
      {items.map((item, key) => {
        return <ExpandableBreakdownItem key={key} item={item} />
      })}
    </div>
  )
}

export default Milestonesab
