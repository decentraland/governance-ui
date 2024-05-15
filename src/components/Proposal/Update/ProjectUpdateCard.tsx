import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Governance } from '../../../clients/Governance'
import { ProjectHealth, UpdateAttributes } from '../../../types/updates'
import locations from '../../../utils/locations'
import CancelIcon from '../../Icon/Cancel'
import CheckCircleIcon from '../../Icon/CheckCircle'
import QuestionCircleIcon from '../../Icon/QuestionCircle'
import WarningIcon from '../../Icon/Warning'
import { DeleteUpdateModal } from '../../Modal/DeleteUpdateModal/DeleteUpdateModal'

import CollapsedProjectUpdateCard from './CollapsedProjectUpdateCard'
import EmptyProjectUpdate from './EmptyProjectUpdate'

interface Props {
  authorAddress?: string
  update?: UpdateAttributes | null
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

const ProjectUpdateCard = ({
  authorAddress,
  update,
  index,
  onUpdateDeleted,
  isCoauthor,
  isLinkable = true,
  showHealth,
}: Props) => {
  const [isDeletingUpdate, setIsDeletingUpdate] = useState(false)
  const [isDeleteUpdateModalOpen, setIsDeleteUpdateModalOpen] = useState(false)
  const navigate = useNavigate()

  if (!update) {
    return <EmptyProjectUpdate />
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
      <CollapsedProjectUpdateCard
        onEditClick={handleEditClick}
        onDeleteUpdateClick={() => setIsDeleteUpdateModalOpen(true)}
        authorAddress={authorAddress}
        update={update}
        index={index}
        isCoauthor={isCoauthor}
        isLinkable={isLinkable}
        showHealth={showHealth}
      />
      <DeleteUpdateModal
        loading={isDeletingUpdate}
        open={isDeleteUpdateModalOpen}
        onClickAccept={handleDeleteUpdateClick}
        onClose={() => setIsDeleteUpdateModalOpen(false)}
      />
    </>
  )
}

export default ProjectUpdateCard
