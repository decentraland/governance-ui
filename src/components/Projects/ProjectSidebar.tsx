import useFormatMessage from '../../hooks/useFormatMessage.ts'
import useProject from '../../hooks/useProject.ts'
import BoxTabs from '../Common/BoxTabs'
import GovernanceSidebar from '../Sidebar/GovernanceSidebar'

import ProjectGeneralInfo from './ProjectGeneralInfo.tsx'
import ProjectSheetTitle from './ProjectSheetTitle.tsx'
import './ProjectSidebar.css'

interface Props {
  projectId: string
  isSidebarVisible: boolean
  onClose: () => void
}

function ProjectSidebar({ projectId, isSidebarVisible, onClose }: Props) {
  const { project, isLoadingProject } = useProject(projectId)
  const t = useFormatMessage()

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
          <BoxTabs.Tab active={true}>{t('project_sheet.general_info.title')}</BoxTabs.Tab>
          <BoxTabs.Tab active={false}>{t('project_sheet.milestones.title')}</BoxTabs.Tab>
          <BoxTabs.Tab active={false}>{t('project_sheet.updates.title')}</BoxTabs.Tab>
          <BoxTabs.Tab active={false}>{t('project_sheet.activity.title')}</BoxTabs.Tab>
        </BoxTabs.Left>
      </BoxTabs>
      {project && <ProjectGeneralInfo project={project} />}
    </GovernanceSidebar>
  )
}

export default ProjectSidebar
