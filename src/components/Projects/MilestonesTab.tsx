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

import ActionableBreakdownContent from './ActionableBreakdownContent'
import ExpandableBreakdownItem from './ExpandableBreakdownItem'
import ProjectSidebarForm, { ProjectSidebarFormFields } from './ProjectSidebarForm'
import ProjectSidebarFormContainer from './ProjectSidebarFormContainer.tsx'

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
  const isEditor = useIsProjectEditor(project)
  const { id: projectId, milestones } = project

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

  const { mutate: deleteMilestone } = useMutation({
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

  const handleSaveMilestone = async (personnel: ProjectMilestone) => {
    createMilestone(personnel)
  }

  const handleCancel = () => {
    setShowForm(false)
  }

  const handleDeleteMilestone = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, milestoneId: string) => {
      e.preventDefault()
      deleteMilestone(milestoneId)
    },
    [deleteMilestone]
  )

  const items = useMemo(
    () =>
      milestones.map<BreakdownItem>(({ id, title, description, delivery_date }) => ({
        title: `${Time(delivery_date).format('YYYY-MM-DD')} - ${title}`,
        content: (
          <ActionableBreakdownContent
            about={description}
            onClick={isEditor ? (e) => handleDeleteMilestone(e, id) : undefined}
            actionLabel={isEditor && <span>{t('component.expandable_breakdown_item.delete_action_label')}</span>}
          />
        ),
      })),
    [milestones, isEditor, handleDeleteMilestone, t]
  )

  if (!milestones || milestones.length === 0) {
    return <Empty title={t('page.project_sidebar.milestones.no_milestones')} />
  }

  //TODO: is loading
  return (
    <div>
      {items.map((item, key) => (
        <ExpandableBreakdownItem key={key} item={item} />
      ))}
      {isEditor && !showForm && (
        <Button basic onClick={handleAddMilestone}>
          {t('project.sheet.milestones.add_label')}
        </Button>
      )}
      <ProjectSidebarFormContainer>
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
      </ProjectSidebarFormContainer>
    </div>
  )
}

export default MilestonesTab
