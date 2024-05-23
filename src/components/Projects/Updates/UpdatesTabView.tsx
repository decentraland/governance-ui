import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthContext } from '../../../context/AuthProvider'
import useFormatMessage from '../../../hooks/useFormatMessage'
import useProposalUpdates from '../../../hooks/useProposalUpdates'
import { UpdateStatus } from '../../../types/updates'
import Time from '../../../utils/date/Time'
import locations from '../../../utils/locations'
import { isBetweenLateThresholdDate } from '../../../utils/updates'
import Empty from '../../Common/Empty'
import ConfirmationModal from '../../Modal/ConfirmationModal'
import ProjectUpdateCardWrapper from '../../Proposal/Update/ProjectUpdateCardWrapper'

import PostUpdateBanner from './PostUpdateBanner'

interface Props {
  proposalId: string
  allowedAddresses: Set<string>
}

function UpdatesTabView({ allowedAddresses, proposalId }: Props) {
  const t = useFormatMessage()
  const navigate = useNavigate()
  const [account] = useAuthContext()
  const [isLateUpdateModalOpen, setIsLateUpdateModalOpen] = useState(false)
  const { publicUpdates, nextUpdate, currentUpdate, pendingUpdates, refetchUpdates } = useProposalUpdates(proposalId)

  const updates = publicUpdates || []
  const hasUpdates = updates.length > 0
  const hasSubmittedUpdate = !!currentUpdate?.completion_date
  const isAllowedToPostUpdate = !!account && allowedAddresses.has(account)
  const nextDueDateRemainingDays = Time(nextUpdate?.due_date).diff(new Date(), 'days')

  const latePendingUpdate = useMemo(
    () =>
      pendingUpdates?.find(
        (update) =>
          update.id !== nextUpdate?.id && Time().isAfter(update.due_date) && isBetweenLateThresholdDate(update.due_date)
      ),
    [nextUpdate?.id, pendingUpdates]
  )
  const navigateToNextUpdateSubmit = useCallback(() => {
    const hasUpcomingPendingUpdate = currentUpdate?.id && currentUpdate?.status === UpdateStatus.Pending
    navigate(
      locations.submitUpdate({
        ...(hasUpcomingPendingUpdate && { id: currentUpdate?.id }),
        proposalId,
      })
    )
  }, [currentUpdate?.id, currentUpdate?.status, navigate, proposalId])
  const handlePendingModalPrimaryClick = () => {
    navigate(
      locations.submitUpdate({
        id: latePendingUpdate?.id,
        proposalId,
      })
    )
  }
  const handlePendingModalSecondaryClick = () => {
    navigateToNextUpdateSubmit()
  }
  const handlePostUpdateClick = useCallback(() => {
    if (latePendingUpdate) {
      setIsLateUpdateModalOpen(true)

      return
    }

    navigateToNextUpdateSubmit()
  }, [latePendingUpdate, navigateToNextUpdateSubmit])

  return (
    <>
      {isAllowedToPostUpdate && !hasSubmittedUpdate && (
        <PostUpdateBanner
          updateNumber={updates.length + 1}
          dueDays={nextDueDateRemainingDays}
          onClick={handlePostUpdateClick}
        />
      )}
      {hasUpdates ? (
        updates.map((update, idx) => (
          <ProjectUpdateCardWrapper
            key={update.id}
            update={update}
            isAllowedToPostUpdate={isAllowedToPostUpdate}
            index={updates.length - idx}
            onUpdateDeleted={refetchUpdates}
          />
        ))
      ) : (
        <Empty title="No updates" />
      )}
      <ConfirmationModal
        isOpen={isLateUpdateModalOpen}
        onPrimaryClick={handlePendingModalPrimaryClick}
        onSecondaryClick={handlePendingModalSecondaryClick}
        onClose={() => setIsLateUpdateModalOpen(false)}
        title={t('page.proposal_detail.grant.pending_update_modal.title')}
        description={
          nextUpdate
            ? t('page.proposal_detail.grant.pending_update_modal.description')
            : t('page.proposal_detail.grant.pending_update_modal.description_last')
        }
        primaryButtonText={t('page.proposal_detail.grant.pending_update_modal.primary_button')}
        secondaryButtonText={
          nextUpdate
            ? t('page.proposal_detail.grant.pending_update_modal.secondary_button')
            : t('page.proposal_detail.grant.pending_update_modal.secondary_button_additional')
        }
      />
    </>
  )
}

export default UpdatesTabView
