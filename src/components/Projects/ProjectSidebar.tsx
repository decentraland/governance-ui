import React, { useMemo, useState } from 'react'

import useFormatMessage from '../../hooks/useFormatMessage.ts'
import useProject from '../../hooks/useProject.ts'
import BoxTabs from '../Common/BoxTabs'
import GovernanceSidebar from '../Sidebar/GovernanceSidebar'

import UpdatesTabView from './Updates/UpdatesTabView.tsx'

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

  const [viewIdx, setViewIdx] = useState(0)

  const MENU_ITEMS: { labelKey: string; view: React.ReactNode }[] = useMemo(
    () => [
      {
        labelKey: 'page.project_sidebar.general_info.title',
        view: project && <ProjectGeneralInfo project={project} />,
      },
      { labelKey: 'page.project_sidebar.milestones.title', view: <></> },
      {
        labelKey: 'page.project_sidebar.updates.title',
        view: (
          <UpdatesTabView
            proposalId={project?.proposal_id || ''}
            allowedAddresses={new Set([project?.author || '', ...(project?.coauthors || [])])}
          />
        ),
      },
      { labelKey: 'page.project_sidebar.activity.title', view: <></> },
    ],
    [project]
  )

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
          {MENU_ITEMS.map((item, idx) => (
            <BoxTabs.Tab key={idx} active={idx === viewIdx} onClick={() => setViewIdx(idx)}>
              {t(item.labelKey)}
            </BoxTabs.Tab>
          ))}
        </BoxTabs.Left>
      </BoxTabs>
      <div className="ProjectSidebar__ContentContainer">{MENU_ITEMS[viewIdx].view}</div>
    </GovernanceSidebar>
  )
}

export default ProjectSidebar
