import React, { useMemo, useState } from 'react'

import { Button } from 'decentraland-ui/dist/components/Button/Button'
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
  isEditor: boolean
}

function getTitle(name: string, address?: string) {
  return address && address.length > 0 ? <Username address={address} size="sm" linked variant="address" /> : name
}

function ActionablePersonnelView({ members, isEditor }: Props) {
  const t = useFormatMessage()
  const [showCreatePersonnelForm, setShowCreatePersonnelForm] = useState(false)

  const handleAddPersonnel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowCreatePersonnelForm(true)
  }

  const handleSavePersonnel = async (personnel: PersonnelAttributes) => {
    await Governance.get().createPersonnel(personnel)
    setShowCreatePersonnelForm(false)
  }

  const handleCancelPersonnel = () => {
    setShowCreatePersonnelForm(false)
  }

  const getDeletePersonnelHandler = (id: string) => {
    return async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      await Governance.get().deletePersonnel(id)
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

  const personnelSchema: ZodSchema<Pick<PersonnelAttributes, 'name' | 'role' | 'about' | 'relevantLink'>> = z.object({
    name: z.string().min(1).max(25),
    role: z.string().min(1),
    about: z.string().min(1),
    relevantLink: z.string().url('Invalid url').optional(),
  })

  const personnelFields: ProjectSidebarFormFields<PersonnelAttributes> = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'role', label: 'Role', type: 'text' },
    { name: 'about', label: 'About', type: 'textarea' },
    { name: 'relevantLink', label: 'Relevant Link', type: 'text' },
  ]

  return (
    <>
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
          initialValues={{ name: '', role: '', about: '', relevantLink: '' } as Partial<PersonnelAttributes>}
          fields={personnelFields}
          onSave={handleSavePersonnel}
          onCancel={handleCancelPersonnel}
          validationSchema={personnelSchema}
        />
      )}
    </>
  )
}

export default ActionablePersonnelView
