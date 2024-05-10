import useProject from '../../hooks/useProject.ts'
import BoxTabs from '../Common/BoxTabs'
import GovernanceSidebar from '../Sidebar/GovernanceSidebar'

import './ProjectSidebar.css'

interface Props {
  projectId: string
  isSidebarVisible: boolean
  onClose: () => void
}

function ProjectSidebar({ projectId, isSidebarVisible, onClose }: Props) {
  const { project, isLoadingProject } = useProject(projectId)

  // const hasUpdates = updates && updates.length > 0
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
      <div className="ProjectSidebar__ContentContainer">
        {/*{hasUpdates && (*/}
        {/*  <ProposalUpdate expanded={false} index={updates.length} update={updates[0]} proposal={proposal} showHealth />*/}
        {/*)}*/}
      </div>
    </GovernanceSidebar>
  )
}

export default ProjectSidebar
