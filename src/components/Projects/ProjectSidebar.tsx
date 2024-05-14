import useProject from '../../hooks/useProject.ts'
import useProposalUpdates from '../../hooks/useProposalUpdates.ts'
import BoxTabs from '../Common/BoxTabs'
import GovernanceSidebar from '../Sidebar/GovernanceSidebar'

import UpdatesTabView from './Updates/UpdatesTabView.tsx'

import './ProjectSidebar.css'

interface Props {
  projectId: string
  isSidebarVisible: boolean
  onClose: () => void
}

function ProjectSidebar({ projectId, isSidebarVisible, onClose }: Props) {
  const { project, isLoadingProject } = useProject(projectId)
  const { publicUpdates } = useProposalUpdates(project?.proposal_id)

  const hasUpdates = publicUpdates && publicUpdates.length > 0
  return (
    <GovernanceSidebar
      className="ProjectSidebar"
      title={project?.title}
      visible={isSidebarVisible}
      onClose={onClose}
      isLoading={isLoadingProject}
    >
      <BoxTabs>
        <BoxTabs.Left>
          <BoxTabs.Tab active={true}>General Info</BoxTabs.Tab>
          <BoxTabs.Tab active={false}>Milestones</BoxTabs.Tab>
          <BoxTabs.Tab active={false}>Reports</BoxTabs.Tab>
          <BoxTabs.Tab active={false}>Activity</BoxTabs.Tab>
        </BoxTabs.Left>
      </BoxTabs>
      {hasUpdates && <UpdatesTabView publicUpdates={publicUpdates} />}
    </GovernanceSidebar>
  )
}

export default ProjectSidebar
