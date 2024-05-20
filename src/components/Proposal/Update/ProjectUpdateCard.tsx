import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Governance } from '../../../clients/Governance'
import { UpdateAttributes } from '../../../types/updates'
import locations from '../../../utils/locations'
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

const ProjectUpdateCard = ({ authorAddress, update, index, onUpdateDeleted, isCoauthor, isLinkable = true }: Props) => {
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
