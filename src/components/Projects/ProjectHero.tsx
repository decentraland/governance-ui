import { Ref, forwardRef } from 'react'

import classNames from 'classnames'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'

import { ProjectStatus } from '../../types/grants.ts'
import { Project } from '../../types/proposals.ts'
import { PillColor } from '../Common/Pill.tsx'
import DotsMenu from '../Icon/DotsMenu.tsx'
import SlimCross from '../Icon/SlimCross.tsx'
import HeroBanner from '../Proposal/HeroBanner.tsx'

import './ProjectHero.css'
import ProjectViewStatusPill from './ProjectViewStatusPill.tsx'

const IS_DOTS_MENU_ENABLED = false

interface Props {
  project: Project
  onClose?: () => void
}

const HIGHLIGHTED_STATUSES = [ProjectStatus.Pending, ProjectStatus.InProgress]

const ProjectHero = forwardRef(({ project, onClose }: Props, ref: Ref<HTMLDivElement>) => {
  const active = HIGHLIGHTED_STATUSES.includes(project.status)

  return (
    <>
      <div className="ProjectHero__Container" ref={ref}>
        <HeroBanner
          active={active}
          color={PillColor.Purple}
          className={classNames(['ProjectHero__Banner', active && 'ProjectHero__Banner--active'])}
        />
        <div className="ProjectHero__Text">
          <h1 className={classNames(['ProjectHero__Title', active && 'ProjectHero__Title--active'])}>
            {project?.title || ''}
          </h1>
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
    </>
  )
})

ProjectHero.displayName = 'ProjectHero'

export default ProjectHero
