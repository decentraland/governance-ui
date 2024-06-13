import { useMemo, useState } from 'react'

import classNames from 'classnames'

import useFormatMessage from '../../hooks/useFormatMessage'
import { ProjectStatus } from '../../types/grants.ts'
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
  isFullscreen?: boolean
}

function ProjectView({ project, onClose, isFullscreen = false }: Props) {
  const t = useFormatMessage()
  const [viewIdx, setViewIdx] = useState(0)
  const showMilestonesTab = !(
    project?.status === ProjectStatus.Finished &&
    (!project.milestones || project.milestones.length === 0)
  )

  const MENU_ITEMS: { labelKey: string; view: React.ReactNode }[] = useMemo(() => {
    return [
      {
        labelKey: 'page.project_sidebar.general_info.title',
        view: project && <ProjectGeneralInfo project={project} />,
      },
      ...(showMilestonesTab
        ? [
            {
              labelKey: 'page.project_sidebar.milestones.title',
              view: project && <MilestonesTab project={project} />,
            },
          ]
        : []),
      {
        labelKey: 'page.project_sidebar.updates.title',
        view: <UpdatesTabView project={project} />,
      },
    ]
  }, [project, showMilestonesTab])
  return (
    <div>
      {project && <ProjectSheetTitle project={project} onClose={onClose} isFullscreen={isFullscreen} />}

      <BoxTabs className="ProjectView__Tabs">
        <BoxTabs.Left>
          {MENU_ITEMS.map((item, idx) => (
            <BoxTabs.Tab key={idx} active={idx === viewIdx} onClick={() => setViewIdx(idx)}>
              {t(item.labelKey)}
            </BoxTabs.Tab>
          ))}
        </BoxTabs.Left>
      </BoxTabs>
      <div
        className={classNames(
          'ProjectView__ContentContainer',
          isFullscreen && 'ProjectView__ContentContainer--fullscreen'
        )}
      >
        {MENU_ITEMS[viewIdx].view}
      </div>
    </div>
  )
}

export default ProjectView
