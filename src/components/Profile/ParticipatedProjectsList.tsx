import { useEffect, useMemo, useState } from 'react'

import useFormatMessage from '../../hooks/useFormatMessage'
import { useSortingByKey } from '../../hooks/useSortingByKey'
import { UserProject } from '../../types/projects.ts'
import FullWidthButton from '../Common/FullWidthButton'

import ParticipatedProjectItem from './ParticipatedProjectItem.tsx'

interface Props {
  address: string
  projects: UserProject[]
}

const MAX_GRANTS = 3

function ParticipatedProjectsList({ projects, address }: Props) {
  const t = useFormatMessage()
  const { sorted } = useSortingByKey(projects, 'enacted_at')
  const [limit, setLimit] = useState(MAX_GRANTS)
  const projectsToShow = useMemo(() => sorted.slice(0, limit), [sorted, limit])

  useEffect(() => setLimit(MAX_GRANTS), [address])

  return (
    <>
      {projectsToShow.map((project) => (
        <ParticipatedProjectItem key={project.id} userProject={project} address={address} />
      ))}
      {sorted.length > limit && (
        <FullWidthButton onClick={() => setLimit(() => limit + MAX_GRANTS)}>
          {t('page.profile.projects.button')}
        </FullWidthButton>
      )}
    </>
  )
}

export default ParticipatedProjectsList
