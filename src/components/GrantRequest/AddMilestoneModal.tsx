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
  date: '',
  description: '',
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
      const { title, description, date } = selectedMilestone
      setValue('title', title)
      setValue('description', description)
      setValue('date', date)
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
          <Label>{t('page.submit_grant.general_info.milestone_modal.description_label')}</Label>
          <Field
            name="description"
            control={control}
            placeholder={t('page.submit_grant.general_info.milestone_modal.description_placeholder')}
            error={!!errors.description}
            message={
              (errors.description?.message || '') +
              ' ' +
              t('page.submit.character_counter', {
                current: watch('description').length,
                limit: schema.description.maxLength,
              })
            }
            rules={{
              required: { value: true, message: t('error.grant.milestone.description_empty') },
              minLength: {
                value: schema.description.minLength,
                message: t('error.grant.milestone.description_too_short'),
              },
              maxLength: {
                value: schema.description.maxLength,
                message: t('error.grant.milestone.description_too_large'),
              },
            }}
          />
        </ContentSection>
        <ContentSection className="ProjectRequestSection__Field">
          <Label>{t('page.submit_grant.general_info.milestone_modal.date_label')}</Label>
          <Field
            name="date"
            type="date"
            onChange={(_event, props) => {
              if (props.value) {
                clearErrors('date')
              }
              setValue('date', props.value)
            }}
            control={control}
            error={!!errors.date?.message}
            message={errors.date?.message || ''}
            rules={{
              required: { value: true, message: t('error.grant.milestone.date_empty') },
              minLength: {
                value: schema.date.minLength,
                message: t('error.grant.milestone.date_too_short'),
              },
              maxLength: { value: schema.date.maxLength, message: t('error.grant.milestone.date_too_large') },
            }}
          />
        </ContentSection>
      </div>
    </AddModal>
  )
}
