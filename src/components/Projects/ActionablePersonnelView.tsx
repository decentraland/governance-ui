import React, { useMemo, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import isEthereumAddress from 'validator/lib/isEthereumAddress'
import { ZodSchema, z } from 'zod'

import { Governance } from '../../clients/Governance'
import useFormatMessage from '../../hooks/useFormatMessage'
import { getProjectQueryKey } from '../../hooks/useProject.ts'
import { PersonnelAttributes, Project } from '../../types/proposals'
import Username from '../Common/Username'
import ErrorMessage from '../Error/ErrorMessage.tsx'
import { BreakdownItem } from '../GrantRequest/BreakdownAccordion'
import Trashcan from '../Icon/Trashcan'

import ActionableBreakdownContent from './ActionableBreakdownContent'
import ExpandableBreakdownItem from './ExpandableBreakdownItem'
import ProjectSidebarForm, { ProjectSidebarFormFields } from './ProjectSidebarForm'
import ProjectSidebarSectionTitle from './ProjectSidebarSectionTitle'

interface Props {
  members: PersonnelAttributes[]
  projectId: string
  isEditor: boolean
}

function getTitle(name: string, address?: string | null) {
  return address && address.length > 0 ? <Username address={address} size="sm" linked variant="address" /> : name
}

const addressCheck = (data: string) => !data || data.length === 0 || (!!data && isEthereumAddress(data))
const NEW_PERSONNEL_SCHEMA: ZodSchema<
  Pick<PersonnelAttributes, 'name' | 'address' | 'role' | 'about' | 'relevantLink'>
> = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  address: z.string().refine(addressCheck, { message: 'Invalid address' }).optional().or(z.null()),
  role: z.string().min(1, 'Role is required').max(80),
  about: z.string().min(1, 'About is required').max(750),
  relevantLink: z.string().min(0).max(200).url().optional().or(z.literal('')),
})

const NEW_PERSONNEL_FIELDS: ProjectSidebarFormFields<PersonnelAttributes> = [
  { name: 'name', label: 'Name/Alias', type: 'text' },
  { name: 'address', label: 'Address', type: 'address' },
  { name: 'role', label: 'Role/Position', type: 'text' },
  { name: 'about', label: 'Bio/About', type: 'textarea' },
  { name: 'relevantLink', label: 'Relevant Link', type: 'text' },
]

function ActionablePersonnelView({ members, projectId, isEditor }: Props) {
  const t = useFormatMessage()
  const [showCreatePersonnelForm, setShowCreatePersonnelForm] = useState(false)
  const [isFormDisabled, setIsFormDisabled] = useState(false)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()

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

  const { mutate: deletePersonnel } = useMutation({
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

  const getDeletePersonnelHandler = (personnelId: string) => {
    return async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      deletePersonnel(personnelId)
    }
  }

  const items = useMemo(
    () =>
      members.map<BreakdownItem>(({ id, name, role, about, relevantLink, address }) => ({
        title: getTitle(name, address),
        subtitle: role,
        content: (
          <ActionableBreakdownContent
            about={about}
            onClick={isEditor ? getDeletePersonnelHandler(id) : undefined}
            relevantLink={relevantLink}
            actionLabel={
              isEditor ? (
                <div className="ActionableBreakdownContent__Button">
                  <Trashcan />
                  {t('component.expandable_breakdown_item.delete_action_label')}
                </div>
              ) : (
                <></>
              )
            }
          />
        ),
      })),
    [members, isEditor, getDeletePersonnelHandler, t]
  )

  //TODO: is loading
  return (
    <div>
      <ProjectSidebarSectionTitle text={t('project.sheet.general_info.personnel.title')} />
      {items.map((item, key) => (
        <ExpandableBreakdownItem key={key} item={item} />
      ))}
      {isEditor && !showCreatePersonnelForm && (
        <Button basic onClick={handleAddPersonnel}>
          {t('project.sheet.general_info.personnel.add_label')}
        </Button>
      )}
      {showCreatePersonnelForm && (
        <ProjectSidebarForm
          initialValues={
            { name: '', address: '', role: '', about: '', relevantLink: '' } as Partial<PersonnelAttributes>
          }
          fields={NEW_PERSONNEL_FIELDS}
          onSave={handleSavePersonnel}
          onCancel={handleCancelPersonnel}
          validationSchema={NEW_PERSONNEL_SCHEMA}
          isFormDisabled={isFormDisabled}
        />
      )}
      {!!error && <ErrorMessage label="Personnel Error" errorMessage={error} />}
    </div>
  )
}

export default ActionablePersonnelView
