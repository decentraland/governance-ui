import { useMemo } from 'react'

import useFormatMessage from '../../hooks/useFormatMessage.ts'
import { TeamMember } from '../../types/grants.ts'
import Username from '../Common/Username.tsx'
import { BreakdownItem } from '../GrantRequest/BreakdownAccordion.tsx'

import EditableBreakdownContent from './EditableBreakdownContent.tsx'
import ExpandableBreakdownItem from './ExpandableBreakdownItem.tsx'
import ProjectSidebarSectionTitle from './ProjectSidebarSectionTitle.tsx'

interface Props {
  members: TeamMember[]
}

function EditablePersonnelView({ members }: Props) {
  const t = useFormatMessage()

  function getTitle(name: string, address?: string) {
    return address && address.length > 0 ? <Username address={address} size="sm" linked variant="address" /> : name
  }

  const items = useMemo(
    () =>
      members.map<BreakdownItem>(({ name, role, about, relevantLink, address }) => ({
        title: getTitle(name, address),
        subtitle: role,
        content: <EditableBreakdownContent about={about} onClick={() => {}} relevantLink={relevantLink} />,
      })),
    [members]
  )

  return (
    <>
      <ProjectSidebarSectionTitle text={t('page.proposal_view.grant.personnel_title')} />
      {items.map((item, key) => {
        return <ExpandableBreakdownItem key={key} item={item} />
      })}
    </>
  )
}

export default EditablePersonnelView
