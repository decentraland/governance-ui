import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'

import { ProjectStatus } from '../../types/grants.ts'
import { ProjectAttributes } from '../../types/proposals.ts'
import { PillColor } from '../Common/Pill.tsx'
import DotsMenu from '../Icon/DotsMenu.tsx'
import SlimCross from '../Icon/SlimCross.tsx'
import HeroBanner from '../Proposal/HeroBanner.tsx'

import ProjectSheetStatusPill from './ProjectSheetStatusPill.tsx'
import './ProjectSheetTitle.css'

const IS_DOTS_MENU_ENABLED = false

interface Props {
  project: ProjectAttributes
  onClose?: () => void
}

const HIGHLIGHTED_STATUSES = [ProjectStatus.Pending, ProjectStatus.InProgress]

export default function ProjectSheetTitle({ project, onClose }: Props) {
  const showHero = HIGHLIGHTED_STATUSES.includes(project.status)

  return (
    <>
      {showHero ? (
        <div className="ProjectHero__Container">
          <HeroBanner active color={PillColor.Purple} className="ProjectHero__Banner" />
          <div className="ProjectHero__Text">
            <h1 className="ProjectHero__Title">{project?.title || ''}</h1>
            <Loader active={!project} />
            {project && <ProjectSheetStatusPill project={project} hero />}
          </div>
          <div className="ProjectHero__Menu">
            {IS_DOTS_MENU_ENABLED && <DotsMenu color="var(--white-900)" className="ProjectSheet__MenuDots" />}
            {onClose && (
              <SlimCross size={14} color="var(--white-900)" onClick={onClose} className="ProjectSheet__MenuCross" />
            )}
          </div>
        </div>
      ) : (
        <div className="ProjectTitle__Container">
          <span className="ProjectTitle__Text">{project?.title || ''}</span>
          <div className="ProjectTitle__Menu">
            <ProjectSheetStatusPill project={project} />
            {IS_DOTS_MENU_ENABLED && <DotsMenu color="var(--black-700)" className="ProjectSheet__MenuDots" />}
            {onClose && (
              <SlimCross size={14} color="var(--black-700)" onClick={onClose} className="ProjectSheet__MenuCross" />
            )}
          </div>
        </div>
      )}
    </>
  )
}
