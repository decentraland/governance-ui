import React, { useCallback, useMemo, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { ZodSchema, z } from 'zod'

import { Governance } from '../../clients/Governance'
import useFormatMessage from '../../hooks/useFormatMessage'
import useIsProjectEditor from '../../hooks/useIsProjectEditor.ts'
import { getProjectQueryKey } from '../../hooks/useProject.ts'
import { Project, ProjectMilestone } from '../../types/proposals'
import Time from '../../utils/date/Time.ts'
import Empty from '../Common/Empty.tsx'
import ErrorMessage from '../Error/ErrorMessage.tsx'
import { BreakdownItem } from '../GrantRequest/BreakdownAccordion'
import ConfirmationModal from '../Modal/ConfirmationModal.tsx'

import ActionableBreakdownContent from './ActionableBreakdownContent'
import DeleteActionLabel from './DeleteActionLabel.tsx'
import ExpandableBreakdownItem from './ExpandableBreakdownItem'
import ProjectInfoCardsContainer from './ProjectInfoCardsContainer'
import ProjectSectionsContainer from './ProjectSectionsContainer.tsx'
import ProjectSidebarForm, { ProjectSidebarFormFields } from './ProjectSidebarForm'

interface Props {
  project: Project
}

const NewMilestoneSchema: ZodSchema<Pick<ProjectMilestone, 'title' | 'description' | 'delivery_date'>> = z.object({
  title: z.string().min(1, 'Title is required').max(80),
  description: z.string().min(1, 'Description is required').max(750),
  delivery_date: z
    .string()
    .date('Delivery date is invalid')
    .refine((date) => Time(date).isAfter(Time()), { message: 'Delivery date must be in the future' }),
})

const NewMilestoneFields: ProjectSidebarFormFields<ProjectMilestone> = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'delivery_date', label: 'Delivery date', type: 'date' },
]

const MILESTONE_INITIAL_VALUES = {
  title: '',
  description: '',
  delivery_date: '',
} as Partial<ProjectMilestone>

function MilestonesTab({ project }: Props) {
  const t = useFormatMessage()
  const [showForm, setShowForm] = useState(false)
  const [isFormDisabled, setIsFormDisabled] = useState(false)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const { isEditor, isEditable } = useIsProjectEditor(project)
  const canEdit = isEditor && isEditable
  const { id: projectId, milestones } = project
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false)
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<ProjectMilestone['id'] | null>(null)

  const handleAddMilestone = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowForm(true)
  }

  const { mutate: createMilestone } = useMutation({
    mutationFn: async (milestone: ProjectMilestone) => {
      setIsFormDisabled(true)
      setError('')
      return await Governance.get().createMilestone({
        ...milestone,
        project_id: projectId,
      })
    },
    onSuccess: (newMilestone) => {
      setShowForm(false)
      setIsFormDisabled(false)
      if (newMilestone) {
        queryClient.setQueryData(getProjectQueryKey(projectId), (oldData?: Project) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            milestones: [...(oldData.milestones || []), newMilestone],
          }
        })
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setIsFormDisabled(false)
      setError(error.body?.error || error.message)
    },
    mutationKey: [`createMilestone`],
  })

  const { mutateAsync: deleteMilestone } = useMutation({
    mutationFn: async (milestoneId: string) => {
      setIsFormDisabled(true)
      setError('')
      return await Governance.get().deleteMilestone(milestoneId)
    },
    onSuccess: (milestoneId) => {
      setIsFormDisabled(false)
      queryClient.setQueryData(getProjectQueryKey(projectId), (oldData?: Project) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          milestones: oldData.milestones?.filter((m) => m.id !== milestoneId),
        }
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setIsFormDisabled(false)
      setError(error.body?.error || error.message)
    },
    mutationKey: [`deleteMilestone`],
  })

  const handleSaveMilestone = async (milestone: ProjectMilestone) => {
    createMilestone(milestone)
  }

  const handleCancel = () => {
    setShowForm(false)
  }

  const handleDeleteMilestone = useCallback(
    (milestoneId: string) => {
      setSelectedMilestoneId(milestoneId)
      setIsDeleteConfirmationModalOpen(true)
    },
    [setIsDeleteConfirmationModalOpen]
  )

  const handleDeleteMilestoneConfirm = async () => {
    if (selectedMilestoneId) {
      await deleteMilestone(selectedMilestoneId)
      setSelectedMilestoneId(null)
    }
    setIsDeleteConfirmationModalOpen(false)
  }

  const handleDeleteMilestoneCancel = () => {
    if (selectedMilestoneId) {
      setSelectedMilestoneId(null)
    }
    setIsDeleteConfirmationModalOpen(false)
  }

  const items = useMemo(
    () =>
      milestones.map<BreakdownItem>(({ id, title, description, delivery_date }) => ({
        title: `${Time(delivery_date).format('YYYY-MM-DD')} - ${title}`,
        content: (
          <ActionableBreakdownContent
            about={description}
            onClick={canEdit ? () => handleDeleteMilestone(id) : undefined}
            actionLabel={canEdit && <DeleteActionLabel />}
          />
        ),
      })),
    [milestones, canEdit, handleDeleteMilestone]
  )

  if ((!milestones || milestones.length === 0) && !isEditor) {
    return (
      <ProjectInfoCardsContainer>
        <Empty description={t('page.project_sidebar.milestones.no_milestones')} />
      </ProjectInfoCardsContainer>
    )
  }

  return (
    <div>
      <ProjectSectionsContainer>
        <ProjectInfoCardsContainer>
          {items.map((item, key) => (
            <ExpandableBreakdownItem key={key} item={item} />
          ))}
          {canEdit && !showForm && (
            <div>
              <Button basic onClick={handleAddMilestone}>
                {t('project.milestones.add_label')}
              </Button>
            </div>
          )}
          {showForm && (
            <ProjectSidebarForm
              initialValues={MILESTONE_INITIAL_VALUES}
              fields={NewMilestoneFields}
              onSave={handleSaveMilestone}
              onCancel={handleCancel}
              validationSchema={NewMilestoneSchema}
              isFormDisabled={isFormDisabled}
            />
          )}
          {!!error && <ErrorMessage label="Milestone error" errorMessage={error} />}
        </ProjectInfoCardsContainer>
      </ProjectSectionsContainer>
      <ConfirmationModal
        isLoading={isFormDisabled}
        isOpen={isDeleteConfirmationModalOpen}
        title={t('modal.delete_item.title')}
        description={t('modal.delete_item.description')}
        onPrimaryClick={handleDeleteMilestoneConfirm}
        onSecondaryClick={handleDeleteMilestoneCancel}
        onClose={handleDeleteMilestoneCancel}
        primaryButtonText={t('modal.delete_item.accept')}
        secondaryButtonText={t('modal.delete_item.reject')}
      />
    </div>
  )
}

export default MilestonesTab
