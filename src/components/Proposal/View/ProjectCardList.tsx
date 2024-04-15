import { useMemo, useState } from 'react'

import useFormatMessage from '../../../hooks/useFormatMessage'
import { Project } from '../../../types/proposals'
import FullWidthButton from '../../Common/FullWidthButton'

import ProjectCard from './ProjectCard'

interface Props {
  projects: Project[]
}

const MAX_PROJECTS = 3

export default function ProjectCardList({ projects }: Props) {
  const t = useFormatMessage()
  const [limit, setLimit] = useState(MAX_PROJECTS)
  const displayedProjects = useMemo(() => projects.slice(0, limit), [limit, projects])

  return (
    <>
      {displayedProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
      {projects.length > limit && (
        <FullWidthButton onClick={() => setLimit(limit + MAX_PROJECTS)}>
          {t('page.proposal_detail.author_details.sidebar.view_more_grants')}
        </FullWidthButton>
      )}
    </>
  )
}
