import useFormatMessage from '../../hooks/useFormatMessage'
import useProposalProjectsByUser from '../../hooks/useProposalProjectsByUser.ts'
import { ActionBox } from '../Common/ActionBox'

import ParticipatedProjectsList from './ParticipatedProjectsList.tsx'

interface Props {
  address: string
}

export default function ProjectsBox({ address }: Props) {
  const t = useFormatMessage()
  const { projects } = useProposalProjectsByUser(address)

  if (!projects) {
    return null
  }

  return (
    <ActionBox title={t('page.profile.projects.title')} info={t('page.profile.projects.info')}>
      <ParticipatedProjectsList projects={projects} address={address} />
    </ActionBox>
  )
}
