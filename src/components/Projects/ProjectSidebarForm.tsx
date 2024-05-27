import { ReactNode } from 'react'
import { DefaultValues, FieldValues, Path, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { ZodSchema } from 'zod'

import useFormatMessage from '../../hooks/useFormatMessage.ts'
import Field from '../Common/Form/Field'
import TextArea from '../Common/Form/TextArea.tsx'

import './ProjectSidebarForm.css'

export type ProjectSidebarFormFields<T> = { name: Path<T>; label: string; type: string }[]

interface ProjectSidebarFormProps<T extends FieldValues> {
  initialValues: DefaultValues<T>
  fields: ProjectSidebarFormFields<T>
  onSave: (values: T) => void
  onCancel: () => void
  validationSchema: ZodSchema<Partial<T>>
  isFormDisabled: boolean
}

function ProjectSidebarForm<T extends FieldValues>({
  initialValues,
  fields,
  onSave,
  onCancel,
  validationSchema,
  isFormDisabled,
}: ProjectSidebarFormProps<T>) {
  const t = useFormatMessage()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    defaultValues: initialValues,
    resolver: zodResolver(validationSchema),
    mode: 'onTouched',
  })

  const renderField = (field: { name: Path<T>; label: string; type: string }) => {
    return (
      <div key={field.name.toString()} className="ProjectSidebarForm__Field">
        <label>{field.label}</label>
        {field.type === 'text' ? (
          <Field
            className="ProjectSidebarForm__Input"
            name={field.name}
            control={control}
            error={!!errors[field.name]}
            message={(errors[field.name]?.message as ReactNode) || ''}
            disabled={isFormDisabled}
          />
        ) : field.type === 'textarea' ? (
          <TextArea
            className="ProjectSidebarForm__Input"
            name={field.name}
            control={control}
            error={errors[field.name]?.message?.toString() || ''}
            message={(errors[field.name]?.message as ReactNode) || ''}
            disabled={isFormDisabled}
          />
        ) : (
          <Field
            name={field.name}
            control={control}
            className="ProjectSidebarForm__Input"
            type="address"
            message={(errors[field.name]?.message as ReactNode) || ''}
            error={!!errors[field.name]}
            disabled={isFormDisabled}
          />
        )}
      </div>
    )
  }

  return (
    <div className="ProjectSidebarForm">
      {fields.map((field) => renderField(field))}
      <div className="ProjectSidebarForm__Actions">
        <Button className="ProjectSidebarForm__Submit" primary onClick={handleSubmit(onSave)}>
          {t('project.sheet.form.save')}
        </Button>
        <Button className="ProjectSidebarForm__Cancel" basic onClick={onCancel}>
          {t('project.sheet.form.cancel')}
        </Button>
      </div>
    </div>
  )
}

export default ProjectSidebarForm
