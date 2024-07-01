import { Ref, forwardRef, useMemo, useState } from 'react'

import useFormatMessage from '../../hooks/useFormatMessage'
import useShowProjectUpdatesCta from '../../hooks/useShowProjectUpdatesCta.ts'
import { ProjectStatus } from '../../types/grants.ts'
import { Project } from '../../types/proposals'
import BoxTabs from '../Common/BoxTabs'
import Dot from '../Icon/Dot.tsx'
import { Desktop1200, NotDesktop1200 } from '../Layout/Desktop1200.tsx'

import UpdatesTabView from './Updates/UpdatesTabView'

import MilestonesTab from './MilestonesTab'
import ProjectGeneralInfo from './ProjectGeneralInfo'
import ProjectHero from './ProjectHero'
import ProjectVerticalTab from './ProjectVerticalTab.tsx'
import './ProjectView.css'
import ProjectViewFundingSection from './ProjectViewFundingSection.tsx'

interface Props {
  project?: Project | null
  onClose?: () => void
}

const ProjectView = forwardRef(({ project, onClose }: Props, ref: Ref<HTMLDivElement>) => {
  const t = useFormatMessage()
  const [viewIdx, setViewIdx] = useState(0)
  const showMilestonesTab = !(
    project?.status === ProjectStatus.Finished &&
    (!project.milestones || project.milestones.length === 0)
  )

  const { showUpdatesCta } = useShowProjectUpdatesCta(project)

  const MENU_ITEMS: { labelKey: string; view: React.ReactNode; showDot?: boolean }[] = useMemo(() => {
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
        showDot: showUpdatesCta,
      },
    ]
  }, [project, showMilestonesTab, showUpdatesCta])

  return (
    <div className="ProjectView">
      {project && <ProjectHero project={project} onClose={onClose} ref={ref} />}
      {project && (
        <Desktop1200>
          <div className="ProjectView__Left">
            {MENU_ITEMS.map((item, idx) => (
              <ProjectVerticalTab key={idx} active={idx === viewIdx} onClick={() => setViewIdx(idx)}>
                {t(item.labelKey)}
                {!!item.showDot && <Dot />}
              </ProjectVerticalTab>
            ))}
          </div>
        </Desktop1200>
      )}
      <div className="ProjectView__ContentContainer">
        <NotDesktop1200>
          <BoxTabs className="ProjectView__Tabs">
            <BoxTabs.Left>
              {MENU_ITEMS.map((item, idx) => (
                <BoxTabs.Tab key={idx} active={idx === viewIdx} onClick={() => setViewIdx(idx)}>
                  {t(item.labelKey)}
                  {!!item.showDot && <Dot />}
                </BoxTabs.Tab>
              ))}
            </BoxTabs.Left>
          </BoxTabs>
        </NotDesktop1200>
        {MENU_ITEMS[viewIdx].view}
      </div>
      <div className="ProjectView__Right">
        {project && project.funding && <ProjectViewFundingSection project={project} compact />}
      </div>
    </div>
  )
})

ProjectView.displayName = 'ProjectView'

export default ProjectView
