import { useQuery } from '@tanstack/react-query'

import { Governance } from '../../clients/Governance'
import { DEFAULT_QUERY_STALE_TIME } from '../../hooks/constants'
import useFormatMessage from '../../hooks/useFormatMessage'
import { ActionBox } from '../Common/ActionBox'

import ParticipatedProjectsList from './ParticipatedProjectsList.tsx'

interface Props {
  address: string
}

export default function ProjectsBox({ address }: Props) {
  const t = useFormatMessage()
  const { data: projects } = useQuery({
    queryKey: ['proposalProjectsByUser', address],
    queryFn: async () => {
      if (address) {
        return await Governance.get().getProjectsByUser(address)
      }
    },
    staleTime: DEFAULT_QUERY_STALE_TIME,
    enabled: !!address,
  })

  console.log('projects', projects)
  if (projects?.total === 0 || !projects?.data) {
    return null
  }

  return (
    <ActionBox title={t('page.profile.projects.title')} info={t('page.profile.projects.info')}>
      <ParticipatedProjectsList projects={projects?.data} address={address} />
    </ActionBox>
  )
}
