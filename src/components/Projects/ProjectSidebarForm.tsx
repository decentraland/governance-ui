import { ReactNode } from 'react'
import { DefaultValues, FieldValues, Path, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { ZodSchema } from 'zod'

import useFormatMessage from '../../hooks/useFormatMessage.ts'
import Field from '../Common/Form/Field'
import TextArea from '../Common/Form/TextArea.tsx'

import './ProjectSidebarForm.css'

type ProjectSidebarFormField<T> = {
  name: Path<T>
  label: string
  type: string
  optional?: boolean
  placeholder?: string
}
export type ProjectSidebarFormFields<T> = ProjectSidebarFormField<T>[]

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
    clearErrors,
    setValue,
  } = useForm<T>({
    defaultValues: initialValues,
    resolver: zodResolver(validationSchema),
    mode: 'onTouched',
  })

  const renderField = ({ name, type, placeholder }: ProjectSidebarFormField<T>) => {
    const commonProps = {
      name,
      control: control,
      className: 'ProjectSidebarForm__Input',
      message: (errors[name]?.message as ReactNode) || '',
      error: !!errors[name],
      disabled: isFormDisabled,
      placeholder,
    }

    switch (type) {
      case 'text':
        return <Field {...commonProps} />
      case 'textarea':
        return <TextArea {...commonProps} error={errors[name]?.message?.toString() || ''} />
      case 'address':
        return <Field {...commonProps} type="address" />
      case 'date':
        return (
          <Field
            {...commonProps}
            type="date"
            onChange={(_event, props) => {
              if (props.value) {
                clearErrors(field.name)
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setValue(field.name, props.value as any)
            }}
          />
        )
      default:
        return <Field {...commonProps} />
    }
  }

  return (
    <div className="ProjectSidebarForm">
      {fields.map((field: ProjectSidebarFormField<T>) => (
        <div key={field.name.toString()} className="ProjectSidebarForm__Field">
          <div className="ProjectSidebarForm__LabelContainer">
            <label className="ProjectSidebarForm__FieldLabel">{field.label}</label>
            {field.optional && <span className="ProjectSidebarForm__Optional">{t('project.sheet.form.optional')}</span>}
          </div>

          {renderField(field)}
        </div>
      ))}
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
