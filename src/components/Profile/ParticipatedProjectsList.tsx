import { useEffect, useMemo, useState } from 'react'

import useFormatMessage from '../../hooks/useFormatMessage'
import { useSortingByKey } from '../../hooks/useSortingByKey'
import { ProposalProject } from '../../types/proposals'
import FullWidthButton from '../Common/FullWidthButton'

import ParticipatedProjectItem from './ParticipatedProjectItem.tsx'

interface Props {
  address: string | null
  grants: ProposalProject[]
}

const MAX_GRANTS = 3

function ParticipatedProjectsList({ grants, address }: Props) {
  const t = useFormatMessage()
  const { sorted } = useSortingByKey(grants, 'enacted_at')
  const [limit, setLimit] = useState(MAX_GRANTS)
  const grantsToShow = useMemo(() => sorted.slice(0, limit), [sorted, limit])

  useEffect(() => setLimit(MAX_GRANTS), [address])

  return (
    <>
      {grantsToShow.map((grant) => (
        <ParticipatedProjectItem key={grant.id} proposalProject={grant} />
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
