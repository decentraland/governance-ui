import { UpdateAttributes } from '../../../types/updates'
import ProjectUpdateCard from '../../Proposal/Update/ProjectUpdateCard'

interface Props {
  publicUpdates: UpdateAttributes[]
}

function UpdatesTabView({ publicUpdates }: Props) {
  return (
    <>
      {publicUpdates.map((update) => (
        <ProjectUpdateCard key={update.id} update={update} authorAddress={''} />
      ))}
    </>
  )
}

export default UpdatesTabView
