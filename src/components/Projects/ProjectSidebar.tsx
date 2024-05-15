import React, { useMemo, useState } from 'react'

import useFormatMessage from '../../hooks/useFormatMessage.ts'
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
  const t = useFormatMessage()

  const [viewIdx, setViewIdx] = useState(0)

  const MENU_ITEMS: { labelKey: string; view: React.ReactNode }[] = useMemo(
    () => [
      { labelKey: 'page.project_sidebar.general_info', view: <></> },
      { labelKey: 'page.project_sidebar.milestones', view: <></> },
      { labelKey: 'page.project_sidebar.updates', view: <UpdatesTabView publicUpdates={publicUpdates} /> },
      { labelKey: 'page.project_sidebar.activity', view: <></> },
    ],
    [publicUpdates]
  )

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
          {MENU_ITEMS.map((item, idx) => (
            <BoxTabs.Tab key={idx} active={idx === viewIdx} onClick={() => setViewIdx(idx)}>
              {t(item.labelKey)}
            </BoxTabs.Tab>
          ))}
        </BoxTabs.Left>
      </BoxTabs>
      {MENU_ITEMS[viewIdx].view}
    </GovernanceSidebar>
  )
}

export default ProjectSidebar
