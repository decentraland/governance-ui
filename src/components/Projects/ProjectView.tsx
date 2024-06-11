import { useMemo, useState } from 'react'

import useFormatMessage from '../../hooks/useFormatMessage'
import { Project } from '../../types/proposals'
import BoxTabs from '../Common/BoxTabs'

import UpdatesTabView from './Updates/UpdatesTabView'

import MilestonesTab from './MilestonesTab'
import ProjectGeneralInfo from './ProjectGeneralInfo'
import ProjectSheetTitle from './ProjectSheetTitle'
import './ProjectView.css'

interface Props {
  project?: Project | null
  onClose?: () => void
}

function ProjectView({ project, onClose }: Props) {
  const t = useFormatMessage()
  const [viewIdx, setViewIdx] = useState(0)

  const MENU_ITEMS: { labelKey: string; view: React.ReactNode }[] = useMemo(
    () => [
      {
        labelKey: 'page.project_sidebar.general_info.title',
        view: project && <ProjectGeneralInfo project={project} />,
      },
      {
        labelKey: 'page.project_sidebar.milestones.title',
        view: project && <MilestonesTab project={project} />,
      },
      {
        labelKey: 'page.project_sidebar.updates.title',
        view: <UpdatesTabView project={project} />,
      },
    ],
    [project]
  )
  return (
    <div>
      {project && <ProjectSheetTitle project={project} onClose={onClose} />}

      <BoxTabs className="ProjectView__Tabs">
        <BoxTabs.Left>
          {MENU_ITEMS.map((item, idx) => (
            <BoxTabs.Tab key={idx} active={idx === viewIdx} onClick={() => setViewIdx(idx)}>
              {t(item.labelKey)}
            </BoxTabs.Tab>
          ))}
        </BoxTabs.Left>
      </BoxTabs>
      <div className="ProjectView__ContentContainer">{MENU_ITEMS[viewIdx].view}</div>
    </div>
  )
}

export default ProjectView
