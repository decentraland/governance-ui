import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'

import { ProjectStatus } from '../../types/grants.ts'
import { Project } from '../../types/proposals.ts'
import { PillColor } from '../Common/Pill.tsx'
import DotsMenu from '../Icon/DotsMenu.tsx'
import SlimCross from '../Icon/SlimCross.tsx'
import HeroBanner from '../Proposal/HeroBanner.tsx'

import ProjectViewStatusPill from './ProjectViewStatusPill.tsx'
import './ProjectViewTitle.css'

const IS_DOTS_MENU_ENABLED = false

interface Props {
  project: Project
  onClose?: () => void
}

const HIGHLIGHTED_STATUSES = [ProjectStatus.Pending, ProjectStatus.InProgress]

export default function ProjectViewTitle({ project, onClose }: Props) {
  const showHero = HIGHLIGHTED_STATUSES.includes(project.status)

  return (
    <>
      {showHero ? (
        <div className="ProjectHero__Container">
          <HeroBanner active color={PillColor.Purple} className="ProjectHero__Banner" />
          <div className="ProjectHero__Text">
            <h1 className="ProjectHero__Title">{project?.title || ''}</h1>
            <Loader active={!project} />
            {project && <ProjectViewStatusPill project={project} hero />}
          </div>
          <div className="ProjectHero__Menu">
            {IS_DOTS_MENU_ENABLED && <DotsMenu color="var(--white-900)" className="ProjectView__MenuDots" />}
            {onClose && (
              <SlimCross size={14} color="var(--white-900)" onClick={onClose} className="ProjectView__MenuCross" />
            )}
          </div>
        </div>
      ) : (
        <div className="ProjectTitle__Container">
          <span className="ProjectTitle__Text">{project?.title || ''}</span>
          <div className="ProjectTitle__Menu">
            <ProjectViewStatusPill project={project} />
            {IS_DOTS_MENU_ENABLED && <DotsMenu color="var(--black-700)" className="ProjectView__MenuDots" />}
            {onClose && (
              <SlimCross size={14} color="var(--black-700)" onClick={onClose} className="ProjectView__MenuCross" />
            )}
          </div>
        </div>
      )}
    </>
  )
}
