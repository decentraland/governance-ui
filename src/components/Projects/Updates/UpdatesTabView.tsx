import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useFormatMessage from '../../../hooks/useFormatMessage'
import useIsProjectEditor from '../../../hooks/useIsProjectEditor'
import useProjectUpdates from '../../../hooks/useProjectUpdates'
import { PROJECT_UPDATES_LATEST_CHECK } from '../../../localStorageKeys.ts'
import { Project } from '../../../types/proposals'
import { UpdateStatus } from '../../../types/updates'
import locations from '../../../utils/locations'
import Empty from '../../Common/Empty'
import ConfirmationModal from '../../Modal/ConfirmationModal'
import ProjectUpdateCardWrapper from '../../Proposal/Update/ProjectUpdateCardWrapper'
import ProjectInfoCardsContainer from '../ProjectInfoCardsContainer'

import PostUpdateBanner from './PostUpdateBanner'

interface Props {
  project?: Project | null
}

function UpdatesTabView({ project }: Props) {
  const t = useFormatMessage()
  const navigate = useNavigate()
  const { isEditor } = useIsProjectEditor(project)
  const [isLateUpdateModalOpen, setIsLateUpdateModalOpen] = useState(false)
  const {
    publicUpdates: updates,
    nextUpdate,
    currentUpdate,
    latePendingUpdate,
    refetchUpdates,
    hasUpdates,
    hasSubmittedUpdate,
    nextDueDateRemainingDays,
  } = useProjectUpdates(project?.id)

  useEffect(() => {
    localStorage.setItem(`${PROJECT_UPDATES_LATEST_CHECK}-${project?.id}`, new Date().toString())
  }, [project?.id])

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
      {isEditor && hasUpdates && !hasSubmittedUpdate && (
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
              isAllowedToPostUpdate={isEditor}
              index={updates.length - idx}
              onUpdateDeleted={refetchUpdates}
            />
          ))
        ) : (
          <div className="Empty__Container">
            <Empty
              description={t(
                isEditor ? 'page.project_sidebar.updates.editor_no_updates' : 'page.project_sidebar.updates.no_updates'
              )}
            />
          </div>
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
