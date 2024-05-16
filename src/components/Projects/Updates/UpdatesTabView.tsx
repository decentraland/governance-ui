import { useAuthContext } from '../../../context/AuthProvider'
import useProposalUpdates from '../../../hooks/useProposalUpdates'
import Time from '../../../utils/date/Time'
import Empty from '../../Common/Empty'
import ProjectUpdateCard from '../../Proposal/Update/ProjectUpdateCard'

import PostUpdateBanner from './PostUpdateBanner'

interface Props {
  proposalId?: string
  allowedAddresses: Set<string>
}

function UpdatesTabView({ allowedAddresses, proposalId }: Props) {
  const { publicUpdates, nextUpdate } = useProposalUpdates(proposalId)
  const nextDueDateRemainingDays = Time(nextUpdate?.due_date).diff(new Date(), 'days')
  const updates = publicUpdates || []
  const hasUpdates = updates.length > 0
  const [account] = useAuthContext()
  const isAllowedToPostUpdate = !!account && allowedAddresses.has(account)
  return (
    <>
      {isAllowedToPostUpdate && nextDueDateRemainingDays <= 7 && (
        <PostUpdateBanner updateNumber={updates.length + 1} dueDays={nextDueDateRemainingDays} />
      )}
      {hasUpdates ? (
        updates.map((update, idx) => (
          <ProjectUpdateCard
            key={update.id}
            update={update}
            authorAddress={update.author}
            index={updates.length - idx}
          />
        ))
      ) : (
        <Empty title="No updates" />
      )}
    </>
  )
}

export default UpdatesTabView
