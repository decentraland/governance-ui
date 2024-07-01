import React, { useCallback, useMemo, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import isEthereumAddress from 'validator/lib/isEthereumAddress'
import { ZodSchema, z } from 'zod'

import { Governance } from '../../clients/Governance'
import { isHttpsURL } from '../../helpers'
import useFormatMessage from '../../hooks/useFormatMessage'
import { getProjectQueryKey } from '../../hooks/useProject.ts'
import { PersonnelAttributes, Project } from '../../types/proposals'
import Username from '../Common/Username'
import ErrorMessage from '../Error/ErrorMessage.tsx'
import { BreakdownItem } from '../GrantRequest/BreakdownAccordion'
import ConfirmationModal from '../Modal/ConfirmationModal.tsx'

import ActionableBreakdownContent from './ActionableBreakdownContent'
import DeleteActionLabel from './DeleteActionLabel.tsx'
import ExpandableBreakdownItem from './ExpandableBreakdownItem'
import ProjectInfoCardsContainer from './ProjectInfoCardsContainer'
import ProjectSectionTitle from './ProjectSectionTitle.tsx'
import ProjectSectionsContainer from './ProjectSectionsContainer.tsx'
import ProjectSidebarForm, { ProjectSidebarFormFields } from './ProjectSidebarForm'

interface Props {
  members: PersonnelAttributes[]
  projectId: string
  canEdit: boolean
}

function getTitle(name: string, address?: string | null) {
  return (
    <>
      {name}
      {address && address.length > 0 ? (
        <>
          {' ('}
          <Username address={address} size="sm" linked variant="address" />
          {')'}
        </>
      ) : undefined}
    </>
  )
}

const addressCheck = (data: string) => !data || data.length === 0 || (!!data && isEthereumAddress(data))
const NewPersonnelSchema: ZodSchema<Pick<PersonnelAttributes, 'name' | 'address' | 'role' | 'about' | 'relevantLink'>> =
  z.object({
    name: z.string().min(1, 'Name is required').max(80),
    address: z.string().refine(addressCheck, { message: 'Invalid address' }).optional().or(z.null()),
    role: z.string().min(1, 'Role is required').max(80),
    about: z.string().min(1, 'About is required').max(750),
    relevantLink: z.string().min(0).max(200).refine(isHttpsURL).optional().or(z.literal('')),
  })

const NewPersonnelFields: ProjectSidebarFormFields<PersonnelAttributes> = [
  { name: 'name', label: 'Name/Alias', type: 'text' },
  { name: 'address', label: 'Address', type: 'address', optional: true },
  { name: 'role', label: 'Role/Position', type: 'text' },
  { name: 'about', label: 'Bio/About', type: 'textarea' },
  { name: 'relevantLink', label: 'Relevant Link', type: 'text', optional: true },
]

const PERSONNEL_INITIAL_VALUES = {
  name: '',
  address: '',
  role: '',
  about: '',
  relevantLink: '',
} as Partial<PersonnelAttributes>

function ActionablePersonnelView({ members, projectId, canEdit }: Props) {
  const t = useFormatMessage()
  const [showCreatePersonnelForm, setShowCreatePersonnelForm] = useState(false)
  const [isFormDisabled, setIsFormDisabled] = useState(false)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false)
  const [selectedPersonnelId, setSelectedPersonnelId] = useState<PersonnelAttributes['id'] | null>(null)

  const handleAddPersonnel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowCreatePersonnelForm(true)
  }

  const { mutate: createPersonnel } = useMutation({
    mutationFn: async (personnel: PersonnelAttributes) => {
      setIsFormDisabled(true)
      setError('')
      return await Governance.get().createPersonnel({ ...personnel, project_id: projectId })
    },
    onSuccess: (newPersonnel) => {
      setShowCreatePersonnelForm(false)
      setIsFormDisabled(false)
      if (newPersonnel) {
        queryClient.setQueryData(getProjectQueryKey(projectId), (oldData?: Project) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            personnel: [...(oldData.personnel || []), newPersonnel],
          }
        })
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setIsFormDisabled(false)
      setError(error.body?.error || error.message)
    },
    mutationKey: [`createPersonnel`],
  })

  const { mutateAsync: deletePersonnel } = useMutation({
    mutationFn: async (personnelId: string) => {
      setIsFormDisabled(true)
      setError('')
      return await Governance.get().deletePersonnel(personnelId)
    },
    onSuccess: (personnelId) => {
      setIsFormDisabled(false)
      queryClient.setQueryData(getProjectQueryKey(projectId), (oldData?: Project) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          personnel: oldData.personnel?.filter((p) => p.id !== personnelId),
        }
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setIsFormDisabled(false)
      setError(error.body?.error || error.message)
    },
    mutationKey: [`deletePersonnel`],
  })

  const handleSavePersonnel = async (personnel: PersonnelAttributes) => {
    createPersonnel(personnel)
  }

  const handleCancelPersonnel = () => {
    setShowCreatePersonnelForm(false)
  }

  const handleDeletePersonnel = useCallback(
    (personnelId: string) => {
      setSelectedPersonnelId(personnelId)
      setIsDeleteConfirmationModalOpen(true)
    },
    [setIsDeleteConfirmationModalOpen]
  )

  const handleDeletePersonnelConfirm = async () => {
    if (selectedPersonnelId) {
      await deletePersonnel(selectedPersonnelId)
      setSelectedPersonnelId(null)
    }
    setIsDeleteConfirmationModalOpen(false)
  }

  const handleDeletePersonnelCancel = () => {
    if (selectedPersonnelId) {
      setSelectedPersonnelId(null)
    }
    setIsDeleteConfirmationModalOpen(false)
  }

  const items = useMemo(
    () =>
      members.map<BreakdownItem>(({ id, name, role, about, relevantLink, address }) => ({
        title: getTitle(name, address),
        subtitle: role,
        content: (
          <ActionableBreakdownContent
            about={about}
            onClick={canEdit ? () => handleDeletePersonnel(id) : undefined}
            relevantLink={relevantLink}
            actionLabel={canEdit && <DeleteActionLabel />}
          />
        ),
      })),
    [members, canEdit, handleDeletePersonnel]
  )

  return (
    <div>
      <ProjectSectionTitle text={t('project.general_info.personnel.title')} />
      <ProjectSectionsContainer>
        <ProjectInfoCardsContainer>
          {items.map((item, key) => (
            <ExpandableBreakdownItem key={key} item={item} />
          ))}
          {canEdit && !showCreatePersonnelForm && (
            <div>
              <Button basic onClick={handleAddPersonnel}>
                {t('project.general_info.personnel.add_label')}
              </Button>
            </div>
          )}
          {showCreatePersonnelForm && (
            <ProjectSidebarForm
              initialValues={PERSONNEL_INITIAL_VALUES}
              fields={NewPersonnelFields}
              onSave={handleSavePersonnel}
              onCancel={handleCancelPersonnel}
              validationSchema={NewPersonnelSchema}
              isFormDisabled={isFormDisabled}
            />
          )}
          {!!error && <ErrorMessage label="Personnel Error" errorMessage={error} />}
        </ProjectInfoCardsContainer>
      </ProjectSectionsContainer>
      <ConfirmationModal
        isLoading={isFormDisabled}
        isOpen={isDeleteConfirmationModalOpen}
        title={t('modal.delete_item.title')}
        description={t('modal.delete_item.description')}
        onPrimaryClick={handleDeletePersonnelConfirm}
        onSecondaryClick={handleDeletePersonnelCancel}
        onClose={handleDeletePersonnelCancel}
        primaryButtonText={t('modal.delete_item.accept')}
        secondaryButtonText={t('modal.delete_item.reject')}
      />
    </div>
  )
}

export default ActionablePersonnelView
