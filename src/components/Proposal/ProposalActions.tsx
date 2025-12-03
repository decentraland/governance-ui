import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useIsMutating } from '@tanstack/react-query'
import { Button } from 'decentraland-ui/dist/components/Button/Button'

import { Governance } from '../../clients/Governance'
import { useAuthContext } from '../../context/AuthProvider'
import useAsyncTask from '../../hooks/useAsyncTask'
import useFormatMessage from '../../hooks/useFormatMessage'
import useIsDAOCouncil from '../../hooks/useIsDAOCouncil'
import useIsProposalOwner from '../../hooks/useIsProposalOwner'
import { getProposalQueryKey } from '../../hooks/useProposal'
import { ProposalAttributes, ProposalStatus } from '../../types/proposals'
import locations from '../../utils/locations'
import { isProposalDeletable, isProposalEnactable, proposalCanBePassedOrRejected } from '../../utils/proposal'
import { DeleteProposalModal } from '../Modal/DeleteProposalModal/DeleteProposalModal'
import { UpdateProposalStatusModal } from '../Modal/UpdateProposalStatusModal/UpdateProposalStatusModal'

interface Props {
  proposal: ProposalAttributes
}

export default function ProposalActions({ proposal }: Props) {
  const navigate = useNavigate()
  const t = useFormatMessage()
  const [account] = useAuthContext()
  const { isDAOCouncil } = useIsDAOCouncil(account)
  const { isOwner } = useIsProposalOwner(proposal)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [confirmStatusUpdate, setConfirmStatusUpdate] = useState<ProposalStatus | null>(null)
  const [deleting, deleteProposal] = useAsyncTask(async () => {
    if (proposal && account && (proposal.user === account || isDAOCouncil)) {
      await Governance.get().deleteProposal(proposal.id)
      navigate(locations.proposals())
    }
  }, [proposal, account, isDAOCouncil])

  const updatingStatus = useIsMutating({ mutationKey: [`updatingProposal#${proposal.id}`] }) > 0

  const proposalStatus = proposal?.status
  const showDeleteButton = isOwner || isDAOCouncil
  const showEnactButton = isDAOCouncil && isProposalEnactable(proposalStatus)
  const showStatusUpdateButton = isDAOCouncil && proposalCanBePassedOrRejected(proposalStatus)

  return (
    <>
      {showDeleteButton && (
        <Button
          basic
          fluid
          loading={deleting}
          disabled={!isProposalDeletable(proposalStatus)}
          onClick={() => setIsDeleteModalOpen(true)}
        >
          {t('page.proposal_detail.delete')}
        </Button>
      )}
      {showEnactButton && (
        <Button basic loading={updatingStatus} fluid onClick={() => setConfirmStatusUpdate(ProposalStatus.Enacted)}>
          {t(
            proposalStatus === ProposalStatus.Passed
              ? 'page.proposal_detail.enact'
              : 'page.proposal_detail.edit_enacted_data'
          )}
        </Button>
      )}
      {showStatusUpdateButton && (
        <>
          <Button basic loading={updatingStatus} fluid onClick={() => setConfirmStatusUpdate(ProposalStatus.Passed)}>
            {t('page.proposal_detail.pass')}
          </Button>
          <Button basic loading={updatingStatus} fluid onClick={() => setConfirmStatusUpdate(ProposalStatus.Rejected)}>
            {t('page.proposal_detail.reject')}
          </Button>
        </>
      )}
      <DeleteProposalModal
        loading={deleting}
        open={isDeleteModalOpen}
        onClickAccept={() => deleteProposal()}
        onClose={() => setIsDeleteModalOpen(false)}
      />
      <UpdateProposalStatusModal
        open={!!confirmStatusUpdate}
        proposal={proposal}
        isDAOCommittee={isDAOCouncil}
        status={confirmStatusUpdate}
        proposalKey={getProposalQueryKey(proposal.id)}
        onClose={() => setConfirmStatusUpdate(null)}
      />
    </>
  )
}
