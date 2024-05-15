import { UpdateAttributes } from '../../../types/updates'
import Empty from '../../Common/Empty'
import ProjectUpdateCard from '../../Proposal/Update/ProjectUpdateCard'

interface Props {
  publicUpdates?: UpdateAttributes[]
}

function UpdatesTabView({ publicUpdates }: Props) {
  const hasUpdates = publicUpdates && publicUpdates.length > 0
  return (
    <>
      {hasUpdates ? (
        publicUpdates.map((update) => (
          <ProjectUpdateCard key={update.id} update={update} authorAddress={update.author} />
        ))
      ) : (
        <Empty title="No updates" />
      )}
    </>
  )
}

export default UpdatesTabView
