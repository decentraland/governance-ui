import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthContext } from '../../../context/AuthProvider'
import useFormatMessage from '../../../hooks/useFormatMessage'
import useProjectUpdates from '../../../hooks/useProjectUpdates'
import { Project } from '../../../types/proposals'
import { UpdateStatus } from '../../../types/updates'
import Time from '../../../utils/date/Time'
import locations from '../../../utils/locations'
import { isBetweenLateThresholdDate } from '../../../utils/updates'
import Empty from '../../Common/Empty'
import ConfirmationModal from '../../Modal/ConfirmationModal'
import ProjectUpdateCardWrapper from '../../Proposal/Update/ProjectUpdateCardWrapper'
import ProjectInfoCardsContainer from '../ProjectInfoCardsContainer'

import PostUpdateBanner from './PostUpdateBanner'

interface Props {
  project?: Project | null
  allowedAddresses: Set<string>
}

function UpdatesTabView({ allowedAddresses, project }: Props) {
  const t = useFormatMessage()
  const navigate = useNavigate()
  const [account] = useAuthContext()
  const [isLateUpdateModalOpen, setIsLateUpdateModalOpen] = useState(false)
  const { publicUpdates, nextUpdate, currentUpdate, pendingUpdates, refetchUpdates } = useProjectUpdates(project?.id)

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
        projectId: project?.id || '',
      })
    )
  }, [currentUpdate?.id, currentUpdate?.status, navigate, project?.id])
  const handlePendingModalPrimaryClick = () => {
    navigate(
      locations.submitUpdate({
        id: latePendingUpdate?.id,
        projectId: project?.id || '',
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
      {isAllowedToPostUpdate && hasUpdates && !hasSubmittedUpdate && (
        <PostUpdateBanner
          updateNumber={updates.length + 1}
          dueDays={nextDueDateRemainingDays}
          onClick={handlePostUpdateClick}
          isMandatory={!!currentUpdate}
        />
      )}
      <ProjectInfoCardsContainer>
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
          <Empty title={t('page.project_sidebar.updates.no_updates')} />
        )}
      </ProjectInfoCardsContainer>
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
