import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Governance } from '../../../clients/Governance'
import { useAuthContext } from '../../../context/AuthProvider'
import { ProposalAttributes, ProposalProject } from '../../../types/proposals'
import { ProjectHealth, UpdateAttributes } from '../../../types/updates'
import locations from '../../../utils/locations'
import { isSameAddress } from '../../../utils/snapshot'
import CancelIcon from '../../Icon/Cancel'
import CheckCircleIcon from '../../Icon/CheckCircle'
import QuestionCircleIcon from '../../Icon/QuestionCircle'
import WarningIcon from '../../Icon/Warning'
import { DeleteUpdateModal } from '../../Modal/DeleteUpdateModal/DeleteUpdateModal'

import CollapsedProposalUpdate from './CollapsedProposalUpdate'
import EmptyProposalUpdate from './EmptyProposalUpdate'
import ExpandedProposalUpdate from './ExpandedProposalUpdate'
import './ProposalUpdate.css'

interface Props {
  proposal: ProposalAttributes | ProposalProject
  update?: UpdateAttributes | null
  expanded: boolean
  index?: number
  onUpdateDeleted?: () => void
  isCoauthor?: boolean
  isLinkable?: boolean
  showHealth?: boolean
}

export const getStatusIcon = (
  health: UpdateAttributes['health'],
  completion_date: UpdateAttributes['completion_date']
) => {
  if (!completion_date) {
    return QuestionCircleIcon
  }

  switch (health) {
    case ProjectHealth.OnTrack:
      return CheckCircleIcon
    case ProjectHealth.AtRisk:
      return WarningIcon
    case ProjectHealth.OffTrack:
    default:
      return CancelIcon
  }
}

const ProposalUpdate = ({
  proposal,
  update,
  expanded,
  index,
  onUpdateDeleted,
  isCoauthor,
  isLinkable = true,
  showHealth,
}: Props) => {
  const [isDeletingUpdate, setIsDeletingUpdate] = useState(false)
  const [isDeleteUpdateModalOpen, setIsDeleteUpdateModalOpen] = useState(false)
  const [account] = useAuthContext()
  const navigate = useNavigate()

  if (!update) {
    return <EmptyProposalUpdate />
  }

  const handleEditClick = () => navigate(locations.edit.update(update.id))

  const handleDeleteUpdateClick = async () => {
    try {
      setIsDeletingUpdate(true)
      await Governance.get().deleteProposalUpdate(update.id)
      setIsDeleteUpdateModalOpen(false)
      if (onUpdateDeleted) {
        onUpdateDeleted()
      }
    } catch (error) {
      console.log('Update delete failed', error)
      setIsDeletingUpdate(false)
    }
  }

  return (
    <>
      {expanded && update?.completion_date ? (
        <ExpandedProposalUpdate
          update={update}
          index={index}
          showMenu={isSameAddress(proposal?.user, account) || isCoauthor}
          onEditClick={handleEditClick}
          onDeleteUpdateClick={() => setIsDeleteUpdateModalOpen(true)}
        />
      ) : (
        <CollapsedProposalUpdate
          onEditClick={handleEditClick}
          onDeleteUpdateClick={() => setIsDeleteUpdateModalOpen(true)}
          proposal={proposal}
          update={update}
          index={index}
          isCoauthor={isCoauthor}
          isLinkable={isLinkable}
          showHealth={showHealth}
        />
      )}
      <DeleteUpdateModal
        loading={isDeletingUpdate}
        open={isDeleteUpdateModalOpen}
        onClickAccept={handleDeleteUpdateClick}
        onClose={() => setIsDeleteUpdateModalOpen(false)}
      />
    </>
  )
}

export default ProposalUpdate
