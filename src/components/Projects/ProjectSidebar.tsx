import useProject from '../../hooks/useProject.ts'
import BoxTabs from '../Common/BoxTabs'
import GovernanceSidebar from '../Sidebar/GovernanceSidebar'

import ProjectSheetTitle from './ProjectSheetTitle.tsx'
import './ProjectSidebar.css'

interface Props {
  projectId: string
  isSidebarVisible: boolean
  onClose: () => void
}

function ProjectSidebar({ projectId, isSidebarVisible, onClose }: Props) {
  const { project, isLoadingProject } = useProject(projectId)

  return (
    <GovernanceSidebar
      className="ProjectSidebar"
      title={project?.title}
      visible={isSidebarVisible}
      onClose={onClose}
      isLoading={isLoadingProject}
      showTitle={false}
    >
      {project && <ProjectSheetTitle project={project} onClose={onClose} />}

      <BoxTabs className="ProjectSidebar__Tabs">
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
