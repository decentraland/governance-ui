import { useState } from 'react'

import classNames from 'classnames'

import { ProjectInList } from '../../../types/proposals'
import locations from '../../../utils/locations'
import { isProposalInCliffPeriod } from '../../../utils/proposal'
import Link from '../../Common/Typography/Link'
import MiniProjectUpdateCard from '../../Proposal/Update/MiniProjectUpdateCard'

import CliffProgress from './CliffProgress'
import './ProjectCard.css'
import ProjectCardHeader from './ProjectCardHeader'
import ProjectCardHeadline from './ProjectCardHeadline'
import VestingProgress from './VestingProgress'

interface Props {
  project: ProjectInList
  hoverable?: boolean
}

const ProjectCard = ({ project, hoverable = false }: Props) => {
  const { id: project_id, proposal_id, funding, latest_update } = project
  const { update } = latest_update || {}
  const enacted_at = funding?.enacted_at
  const [expanded, setExpanded] = useState(!hoverable)
  const proposalInCliffPeriod = !!enacted_at && isProposalInCliffPeriod(enacted_at)

  return (
    <Link
      href={project_id ? locations.project({ id: project_id }) : locations.proposal(proposal_id)}
      onMouseEnter={() => hoverable && setExpanded(true)}
      onMouseLeave={() => hoverable && setExpanded(false)}
      className={classNames('ProjectCard', hoverable && 'ProjectCard__Expanded')}
    >
      <div>
        <ProjectCardHeader project={project} />
        <ProjectCardHeadline project={project} expanded={expanded} hoverable={hoverable} />
        {proposalInCliffPeriod ? (
          <CliffProgress enactedAt={enacted_at} />
        ) : (
          <VestingProgress projectFunding={project.funding} />
        )}
      </div>
      {update && (
        <div className="ProjectCard__UpdateContainer">
          <MiniProjectUpdateCard update={update} index={update?.index} />
        </div>
      )}
    </Link>
  )
}

export default ProjectCard
