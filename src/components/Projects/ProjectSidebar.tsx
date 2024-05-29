import useProject from '../../hooks/useProject.ts'
import GovernanceSidebar from '../Sidebar/GovernanceSidebar'

import './ProjectSidebar.css'
import ProjectView from './ProjectView.tsx'

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
      <ProjectView project={project} onClose={onClose} />
    </GovernanceSidebar>
  )
}

export default ProjectSidebar
