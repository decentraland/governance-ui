import React, { useMemo, useState } from 'react'

import { Button } from 'decentraland-ui/dist/components/Button/Button'
import isEthereumAddress from 'validator/lib/isEthereumAddress'
import { ZodSchema, z } from 'zod'

import { Governance } from '../../clients/Governance'
import useFormatMessage from '../../hooks/useFormatMessage'
import { PersonnelAttributes } from '../../types/proposals'
import Username from '../Common/Username'
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

function getTitle(name: string, address?: string) {
  return address && address.length > 0 ? <Username address={address} size="sm" linked variant="address" /> : name
}

function ActionablePersonnelView({ members, projectId, isEditor }: Props) {
  const t = useFormatMessage()
  const [showCreatePersonnelForm, setShowCreatePersonnelForm] = useState(false)
  const [isFormDisabled, setIsFormDisabled] = useState(false)

  const handleAddPersonnel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowCreatePersonnelForm(true)
  }

  const handleSavePersonnel = async (personnel: PersonnelAttributes) => {
    setIsFormDisabled(true)
    const newPersonnel = await Governance.get().createPersonnel({ ...personnel, project_id: projectId }) //TODO: try/catch handle error vs success
    console.log('newPersonnel', newPersonnel)
    setIsFormDisabled(false)
    setShowCreatePersonnelForm(false)
  }

  const handleCancelPersonnel = () => {
    setShowCreatePersonnelForm(false)
  }

  const getDeletePersonnelHandler = (id: string) => {
    return async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      await Governance.get().deletePersonnel(id) //TODO: try/catch handle error vs success
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
    [members, isEditor, t]
  )

  const addressCheck = (data: string) => !data || data.length === 0 || (!!data && isEthereumAddress(data))
  const personnelSchema: ZodSchema<Pick<PersonnelAttributes, 'name' | 'address' | 'role' | 'about' | 'relevantLink'>> =
    z.object({
      name: z.string().min(1, 'Name is required').max(80),
      address: z.string().refine(addressCheck, { message: 'Invalid address' }),
      role: z.string().min(1, 'Role is required').max(80),
      about: z.string().min(1, 'About is required').max(750),
      relevantLink: z.string().min(0).max(200).url().optional().or(z.literal('')),
    })

  const personnelFields: ProjectSidebarFormFields<PersonnelAttributes> = [
    { name: 'name', label: 'Name/Alias', type: 'text' },
    { name: 'address', label: 'Address', type: 'address' },
    { name: 'role', label: 'Role/Position', type: 'text' },
    { name: 'about', label: 'Bio/About', type: 'textarea' },
    { name: 'relevantLink', label: 'Relevant Link', type: 'text' },
  ]

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
          fields={personnelFields}
          onSave={handleSavePersonnel}
          onCancel={handleCancelPersonnel}
          validationSchema={personnelSchema}
          isFormDisabled={isFormDisabled}
        />
      )}
    </div>
  )
}

export default ActionablePersonnelView
