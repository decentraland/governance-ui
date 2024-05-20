import { useMemo } from 'react'

import useFormatMessage from '../../hooks/useFormatMessage.ts'
import { TeamMember } from '../../types/grants.ts'
import { BreakdownItem } from '../GrantRequest/BreakdownAccordion.tsx'

import EditableBreakdownContent from './EditableBreakdownContent.tsx'
import ExpandableBreakdownItem from './ExpandableBreakdownItem.tsx'
import ProjectSidebarTitle from './ProjectSidebarTitle.tsx'

interface Props {
  members: TeamMember[]
}

function EditablePersonnelView({ members }: Props) {
  const t = useFormatMessage()
  const items = useMemo(
    () =>
      members.map<BreakdownItem>(({ name, role, about, relevantLink, address }) => ({
        title: name + (address || ''), //TODO: how do we display the address?
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

export default EditablePersonnelView
