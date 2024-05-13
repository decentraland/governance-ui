import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'

import { ProjectStatus } from '../../types/grants.ts'
import { ProjectAttributes } from '../../types/proposals.ts'
import { PillColor } from '../Common/Pill.tsx'
import Cross from '../Icon/Cross.tsx'
import DotsMenu from '../Icon/DotsMenu.tsx'
import HeroBanner from '../Proposal/HeroBanner.tsx'

import ProjectSheetStatusPill from './ProjectSheetStatusPill.tsx'
import './ProjectSheetTitle.css'

interface Props {
  project: ProjectAttributes
  onClose: () => void
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
          <button className="ProjectHero__Menu" onClick={onClose}>
            <DotsMenu color="var(--white-900)" />
            <Cross size={14} color="var(--white-900)" />
          </button>
        </div>
      ) : (
        <div className="ProjectTitle__Container">
          <span className="ProjectTitle__Text">{project?.title || ''}</span>
          <div className="ProjectTitle__Menu">
            <ProjectSheetStatusPill project={project} />
            <DotsMenu color="var(--black-700)" />
            <Cross size={14} color="var(--black-700)" onClick={onClose} />
          </div>
        </div>
      )}
    </>
  )
}
