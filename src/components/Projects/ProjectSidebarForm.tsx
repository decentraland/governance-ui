import { ReactNode } from 'react'
import { DefaultValues, FieldValues, Path, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { ZodSchema } from 'zod'

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
}

function ProjectSidebarForm<T extends FieldValues>({
  initialValues,
  fields,
  onSave,
  onCancel,
  validationSchema,
}: ProjectSidebarFormProps<T>) {
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
        {field.type === 'textarea' ? (
          <TextArea
            className="ProjectSidebarForm__Input"
            name={field.name}
            control={control}
            error={errors[field.name]?.message?.toString() || ''}
            message={(errors[field.name]?.message as ReactNode) || ''}
          />
        ) : (
          <Field
            className="ProjectSidebarForm__Input"
            name={field.name}
            control={control}
            error={!!errors[field.name]}
            message={(errors[field.name]?.message as ReactNode) || ''}
          />
        )}
      </div>
    )
  }

  return (
    <div className="ProjectSidebarForm">
      {fields.map((field) => renderField(field))}
      <div className="ProjectSidebarForm__Actions">
        <Button primary onClick={handleSubmit(onSave)}>
          Save
        </Button>
        <Button basic onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default ProjectSidebarForm
