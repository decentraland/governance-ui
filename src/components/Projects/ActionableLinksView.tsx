import React, { useMemo, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { ZodSchema, z } from 'zod'

import { Governance } from '../../clients/Governance'
import useFormatMessage from '../../hooks/useFormatMessage'
import { getProjectQueryKey } from '../../hooks/useProject.ts'
import { Project, ProjectLink } from '../../types/proposals'
import Link from '../Common/Typography/Link.tsx'
import ErrorMessage from '../Error/ErrorMessage.tsx'
import { BreakdownItem } from '../GrantRequest/BreakdownAccordion'
import BlueLinkIcon from '../Icon/BlueLinkIcon.tsx'
import Trashcan from '../Icon/Trashcan'

import ActionableBreakdownContent from './ActionableBreakdownContent'
import ExpandableBreakdownItem from './ExpandableBreakdownItem'
import ProjectInfoCardsContainer from './ProjectInfoCardsContainer'
import ProjectSectionsContainer from './ProjectSectionsContainer.tsx'
import ProjectSidebarForm, { ProjectSidebarFormFields } from './ProjectSidebarForm'
import ProjectSidebarSectionTitle from './ProjectSidebarSectionTitle'

interface Props {
  links: ProjectLink[]
  projectId: string
  isEditor: boolean
}

const NewLinkSchema: ZodSchema<Pick<ProjectLink, 'label' | 'url'>> = z.object({
  label: z.string().min(1, 'Label is required').max(80),
  url: z.string().min(0).max(200).url(),
})
const NewLinkFields: ProjectSidebarFormFields<ProjectLink> = [
  { name: 'label', label: 'label', type: 'text' },
  { name: 'url', label: 'URL', type: 'text', placeholder: 'https://' },
]
const LINK_INITIAL_VALUES = { label: '', url: '' } as Partial<ProjectLink>

function ActionableLinksView({ links, projectId, isEditor }: Props) {
  const t = useFormatMessage()
  const [showCreate, setShowCreate] = useState(false)
  const [isFormDisabled, setIsFormDisabled] = useState(false)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowCreate(true)
  }

  const { mutate: createProjectLink } = useMutation({
    mutationFn: async (projectLink: ProjectLink) => {
      setIsFormDisabled(true)
      setError('')
      return await Governance.get().createProjectLink({ ...projectLink, project_id: projectId })
    },
    onSuccess: (newProjectLink) => {
      setShowCreate(false)
      setIsFormDisabled(false)
      if (newProjectLink) {
        queryClient.setQueryData(getProjectQueryKey(projectId), (oldData?: Project) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            links: [...(oldData.links || []), newProjectLink],
          }
        })
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setIsFormDisabled(false)
      setError(error.body?.error || error.message)
    },
    mutationKey: [`createProjectLink`],
  })

  const { mutate: deleteProjectLink } = useMutation({
    mutationFn: async (projectLinkId: string) => {
      setIsFormDisabled(true)
      setError('')
      return await Governance.get().deleteProjectLink(projectLinkId)
    },
    onSuccess: (projectLinkId) => {
      setIsFormDisabled(false)
      queryClient.setQueryData(getProjectQueryKey(projectId), (oldData?: Project) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          links: oldData.links?.filter((p) => p.id !== projectLinkId),
        }
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setIsFormDisabled(false)
      setError(error.body?.error || error.message)
    },
    mutationKey: [`deleteProjectLink`],
  })

  const handleSave = async (projectLink: ProjectLink) => {
    createProjectLink(projectLink)
  }

  const handleCancel = () => {
    setShowCreate(false)
  }

  const getDeleteProjectLinkHandler = useMemo(() => {
    return (projectLinkId: string) => {
      return async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        deleteProjectLink(projectLinkId)
      }
    }
  }, [deleteProjectLink])

  const items = useMemo(
    () =>
      links.map<BreakdownItem>(({ id, label, url }) => ({
        title: (
          <Link className="ExpandableBreakdownItem__Title" href={url} target="_blank">
            <BlueLinkIcon /> {label}
          </Link>
        ),
        content: (
          <ActionableBreakdownContent
            about={url}
            onClick={isEditor ? getDeleteProjectLinkHandler(id) : undefined}
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
    [links, isEditor, getDeleteProjectLinkHandler, t]
  )

  //TODO: is loading
  return (
    <div>
      <ProjectSidebarSectionTitle text={t('project.sheet.general_info.links.title')} />
      <ProjectSectionsContainer>
        <ProjectInfoCardsContainer slim>
          {items.map((item, key) => (
            <ExpandableBreakdownItem key={key} item={item} />
          ))}
        </ProjectInfoCardsContainer>
        {isEditor && !showCreate && (
          <div>
            <Button basic onClick={handleAdd}>
              {t('project.sheet.general_info.links.add_label')}
            </Button>
          </div>
        )}
        {showCreate && (
          <ProjectSidebarForm
            initialValues={LINK_INITIAL_VALUES}
            fields={NewLinkFields}
            onSave={handleSave}
            onCancel={handleCancel}
            validationSchema={NewLinkSchema}
            isFormDisabled={isFormDisabled}
          />
        )}
        {!!error && <ErrorMessage label="Link Error" errorMessage={error} />}
      </ProjectSectionsContainer>
    </div>
  )
}

export default ActionableLinksView
