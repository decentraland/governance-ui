import { useMemo } from 'react'

import useFormatMessage from '../../hooks/useFormatMessage'
import { TeamMember } from '../../types/grants'
import EditableBreakdownContent from '../Projects/EditableBreakdownContent.tsx'
import ExpandableBreakdownItem from '../Projects/ExpandableBreakdownItem.tsx'
import ProjectSidebarTitle from '../Projects/ProjectSidebarTitle.tsx'

import { BreakdownItem } from './BreakdownAccordion'

interface Props {
  members: TeamMember[]
}

function PersonnelView({ members }: Props) {
  const t = useFormatMessage()
  const items = useMemo(
    () =>
      members.map<BreakdownItem>(({ name, role, about, relevantLink, address }) => ({
        title: name + (address || ''),
        subtitle: role,
        content: <EditableBreakdownContent about={about} onClick={() => {}} relevantLink={relevantLink} />,
      })),
    [members]
  )

  return (
    <>
      <ProjectSidebarTitle text={t('page.proposal_view.grant.personnel_title')} />
      {items.map((item, key) => {
        return <ExpandableBreakdownItem key={key} item={item} />
      })}
    </>
  )
}

export default PersonnelView
