import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import useFormatMessage from '../../hooks/useFormatMessage'
import { Milestone, MilestoneItemSchema } from '../../types/grants'
import Field from '../Common/Form/Field'
import Label from '../Common/Typography/Label'
import { ContentSection } from '../Layout/ContentLayout'

import AddModal from './AddModal'

const INITIAL_MILESTONE_ITEM: Milestone = {
  title: '',
  delivery_date: '',
  tasks: '',
}

const schema = MilestoneItemSchema

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (item: Milestone) => void
  onDelete: () => void
  selectedMilestone: Milestone | null
}

export default function AddMilestoneModal({ isOpen, onClose, onSubmit, selectedMilestone, onDelete }: Props) {
  const t = useFormatMessage()
  const {
    formState: { errors },
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    clearErrors,
  } = useForm<Milestone>({
    defaultValues: INITIAL_MILESTONE_ITEM,
    mode: 'onTouched',
  })

  const onSubmitForm: SubmitHandler<Milestone> = (data) => {
    onSubmit(data)
    onClose()
    reset()
  }

  useEffect(() => {
    if (selectedMilestone) {
      const { title, tasks, delivery_date } = selectedMilestone
      setValue('title', title)
      setValue('tasks', tasks)
      setValue('delivery_date', delivery_date)
    }
  }, [selectedMilestone, setValue])

  return (
    <AddModal
      title={t('page.submit_grant.general_info.milestone_modal.title')}
      isOpen={isOpen}
      onClose={onClose}
      onPrimaryClick={handleSubmit(onSubmitForm)}
      onSecondaryClick={selectedMilestone ? onDelete : undefined}
    >
      <div>
        <ContentSection className="ProjectRequestSection__Field">
          <Label>{t('page.submit_grant.general_info.milestone_modal.title_label')}</Label>
          <Field
            name="title"
            control={control}
            placeholder={t('page.submit_grant.general_info.milestone_modal.title_placeholder')}
            error={!!errors.title}
            message={
              (errors.title?.message || '') +
              ' ' +
              t('page.submit.character_counter', {
                current: watch('title').length,
                limit: schema.title.maxLength,
              })
            }
            rules={{
              required: { value: true, message: t('error.grant.milestone.title_empty') },
              minLength: {
                value: schema.title.minLength,
                message: t('error.grant.milestone.title_too_short'),
              },
              maxLength: { value: schema.title.maxLength, message: t('error.grant.milestone.title_too_large') },
            }}
          />
        </ContentSection>
        <ContentSection className="ProjectRequestSection__Field">
          <Label>{t('page.submit_grant.general_info.milestone_modal.tasks_label')}</Label>
          <Field
            name="tasks"
            control={control}
            placeholder={t('page.submit_grant.general_info.milestone_modal.tasks_placeholder')}
            error={!!errors.tasks}
            message={
              (errors.tasks?.message || '') +
              ' ' +
              t('page.submit.character_counter', {
                current: watch('tasks').length,
                limit: schema.tasks.maxLength,
              })
            }
            rules={{
              required: { value: true, message: t('error.grant.milestone.tasks_empty') },
              minLength: {
                value: schema.tasks.minLength,
                message: t('error.grant.milestone.tasks_too_short'),
              },
              maxLength: {
                value: schema.tasks.maxLength,
                message: t('error.grant.milestone.tasks_too_large'),
              },
            }}
          />
        </ContentSection>
        <ContentSection className="ProjectRequestSection__Field">
          <Label>{t('page.submit_grant.general_info.milestone_modal.date_label')}</Label>
          <Field
            name="delivery_date"
            type="date"
            onChange={(_event, props) => {
              if (props.value) {
                clearErrors('delivery_date')
              }
              setValue('delivery_date', props.value)
            }}
            control={control}
            error={!!errors.delivery_date?.message}
            message={errors.delivery_date?.message || ''}
            rules={{
              required: { value: true, message: t('error.grant.milestone.date_empty') },
              minLength: {
                value: schema.delivery_date.minLength,
                message: t('error.grant.milestone.date_too_short'),
              },
              maxLength: { value: schema.delivery_date.maxLength, message: t('error.grant.milestone.date_too_large') },
            }}
          />
        </ContentSection>
      </div>
    </AddModal>
  )
}
