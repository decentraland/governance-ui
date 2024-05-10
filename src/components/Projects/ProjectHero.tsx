import { Ref, forwardRef } from 'react'

import classNames from 'classnames'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'

import { ProjectStatus } from '../../types/grants.ts'
import { ProjectAttributes } from '../../types/proposals.ts'
import { PillColor } from '../Common/Pill.tsx'
import Cross from '../Icon/Cross.tsx'
import HeroBanner from '../Proposal/HeroBanner.tsx'

import './ProjectHero.css'
import ProjectSheetStatusPill from './ProjectSheetStatusPill.tsx'

interface Props {
  project: ProjectAttributes
}

const ProjectHero = forwardRef(({ project }: Props, ref: Ref<HTMLDivElement>) => {
  const isOngoing = true || (project && project.status === ProjectStatus.InProgress) //TODO: remove bool

  // TODO cross and three dots menu

  return (
    <div className="ProjectHero__Container" ref={ref}>
      <HeroBanner
        active={isOngoing}
        color={isOngoing ? PillColor.Purple : PillColor.White}
        className="ProjectHeroBanner"
      />
      <div className="ProjectHero__Text">
        <h1 className={classNames('ProjectHero__Title', !isOngoing && 'ProjectHero__Title--finished')}>
          {project?.title || ''}
        </h1>
        <Loader active={!project} />
        {project && (
          <div className="ProposalDetailPage__Labels">
            <ProjectSheetStatusPill status={project.status} />
            {/*  TODO: project status pill */}
          </div>
        )}
      </div>
      <Cross />
    </div>
  )
})

ProjectHero.displayName = 'ProposalHero'

export default ProjectHero
