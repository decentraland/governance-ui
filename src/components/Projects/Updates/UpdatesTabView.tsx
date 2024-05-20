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

const SHOW_BANNER_THRESHOLD = 15

function UpdatesTabView({ allowedAddresses, proposalId }: Props) {
  const { publicUpdates, nextUpdate, currentUpdate } = useProposalUpdates(proposalId)
  const nextDueDateRemainingDays = Time(nextUpdate?.due_date).diff(new Date(), 'days')
  const updates = publicUpdates || []
  const hasUpdates = updates.length > 0
  const [account] = useAuthContext()
  const isAllowedToPostUpdate = !!account && allowedAddresses.has(account)
  return (
    <>
      {isAllowedToPostUpdate && nextDueDateRemainingDays <= SHOW_BANNER_THRESHOLD && (
        <PostUpdateBanner
          updateNumber={updates.length + 1}
          dueDays={nextDueDateRemainingDays}
          currentUpdate={currentUpdate}
          proposalId={proposalId || ''}
        />
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
