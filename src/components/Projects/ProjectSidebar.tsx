import { Project, ProposalAttributes } from '../../types/proposals'
import { UpdateAttributes } from '../../types/updates'
import BoxTabs from '../Common/BoxTabs'
import ProposalUpdate from '../Proposal/Update/ProposalUpdate'
import GovernanceSidebar from '../Sidebar/GovernanceSidebar'

import './ProjectSidebar.css'

interface Props {
  isSidebarVisible: boolean
  onClose: () => void
  title: string
  updates?: UpdateAttributes[]
  proposal: ProposalAttributes | Project
}

function ProjectSidebar({ isSidebarVisible, onClose, title, updates, proposal }: Props) {
  const hasUpdates = updates && updates.length > 0
  return (
    <GovernanceSidebar className="ProjectSidebar" title={title} visible={isSidebarVisible} onClose={onClose}>
      <BoxTabs>
        <BoxTabs.Left>
          <BoxTabs.Tab active={true}>General Info</BoxTabs.Tab>
          <BoxTabs.Tab active={false}>Milestones</BoxTabs.Tab>
          <BoxTabs.Tab active={false}>Reports</BoxTabs.Tab>
          <BoxTabs.Tab active={false}>Activity</BoxTabs.Tab>
        </BoxTabs.Left>
      </BoxTabs>
      <div className="ProjectSidebar__ContentContainer">
        {hasUpdates && (
          <ProposalUpdate expanded={false} index={updates.length} update={updates[0]} proposal={proposal} showHealth />
        )}
      </div>
    </GovernanceSidebar>
  )
}

export default ProjectSidebar
