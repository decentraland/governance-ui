import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Governance } from '../../../clients/Governance'
import { UpdateAttributes } from '../../../types/updates'
import locations from '../../../utils/locations'
import { DeleteUpdateModal } from '../../Modal/DeleteUpdateModal/DeleteUpdateModal'

import EmptyProjectUpdate from './EmptyProjectUpdate'
import ProjectUpdateCard from './ProjectUpdateCard'

interface Props {
  update?: UpdateAttributes | null
  index?: number
  onUpdateDeleted?: () => void
  isLinkable?: boolean
  showHealth?: boolean
  isAllowedToPostUpdate: boolean
}

const ProjectUpdateCardWrapper = ({
  update,
  index,
  onUpdateDeleted,
  isAllowedToPostUpdate,
  isLinkable = true,
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
      await Governance.get().deleteProjectUpdate(update.id)
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
      <ProjectUpdateCard
        onEditClick={handleEditClick}
        onDeleteUpdateClick={() => setIsDeleteUpdateModalOpen(true)}
        isAllowedToPostUpdate={isAllowedToPostUpdate}
        update={update}
        index={index}
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

export default ProjectUpdateCardWrapper
