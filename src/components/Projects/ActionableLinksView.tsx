import React, { useCallback, useMemo, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { ZodSchema, z } from 'zod'

import { Governance } from '../../clients/Governance'
import { isHttpsURL } from '../../helpers'
import useFormatMessage from '../../hooks/useFormatMessage'
import { getProjectQueryKey } from '../../hooks/useProject.ts'
import { Project, ProjectLink } from '../../types/proposals'
import { proposalUrl } from '../../utils/proposal.ts'
import Link from '../Common/Typography/Link.tsx'
import ErrorMessage from '../Error/ErrorMessage.tsx'
import BlueLinkIcon from '../Icon/BlueLinkIcon.tsx'
import ConfirmationModal from '../Modal/ConfirmationModal.tsx'

import ActionableBreakdownContent from './ActionableBreakdownContent'
import DeleteActionLabel from './DeleteActionLabel.tsx'
import ExpandableBreakdownItem from './ExpandableBreakdownItem'
import ProjectInfoCardsContainer from './ProjectInfoCardsContainer'
import ProjectSectionsContainer from './ProjectSectionsContainer.tsx'
import ProjectSheetLinkItem from './ProjectSheetLinkItem.tsx'
import ProjectSidebarForm, { ProjectSidebarFormFields } from './ProjectSidebarForm'
import ProjectSidebarSectionTitle from './ProjectSidebarSectionTitle'

interface Props {
  links: ProjectLink[]
  projectId: string
  proposalId: string
  canEdit: boolean
}

const NewLinkSchema: ZodSchema<Pick<ProjectLink, 'label' | 'url'>> = z.object({
  label: z.string().min(1, 'Label is required').max(80),
  url: z.string().min(0).max(200).refine(isHttpsURL),
})
const NewLinkFields: ProjectSidebarFormFields<ProjectLink> = [
  { name: 'label', label: 'label', type: 'text' },
  { name: 'url', label: 'URL', type: 'text', placeholder: 'https://' },
]
const LINK_INITIAL_VALUES = { label: '', url: '' } as Partial<ProjectLink>

function ActionableLinksView({ links, projectId, proposalId, canEdit }: Props) {
  const t = useFormatMessage()
  const [showCreate, setShowCreate] = useState(false)
  const [isFormDisabled, setIsFormDisabled] = useState(false)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false)
  const [selectedProjectLinkId, setSelectedProjectLinkId] = useState<ProjectLink['id'] | null>(null)

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

  const { mutateAsync: deleteProjectLink } = useMutation({
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

  const handleDeleteLink = useCallback(
    (linkId: string) => {
      setSelectedProjectLinkId(linkId)
      setIsDeleteConfirmationModalOpen(true)
    },
    [setIsDeleteConfirmationModalOpen]
  )

  const handleDeleteLinkConfirm = async () => {
    if (selectedProjectLinkId) {
      await deleteProjectLink(selectedProjectLinkId)
      setSelectedProjectLinkId(null)
    }
    setIsDeleteConfirmationModalOpen(false)
  }

  const handleDeleteLinkCancel = () => {
    if (selectedProjectLinkId) {
      setSelectedProjectLinkId(null)
    }
    setIsDeleteConfirmationModalOpen(false)
  }

  const items = useMemo(
    () =>
      links.map(({ id, label, url }, index) => {
        return canEdit ? (
          <ExpandableBreakdownItem
            key={index}
            item={{
              title: (
                <Link className="ExpandableBreakdownItem__Title" href={url} target="_blank">
                  <BlueLinkIcon /> {label}
                </Link>
              ),
              content: (
                <ActionableBreakdownContent
                  about={url}
                  onClick={() => handleDeleteLink(id)}
                  actionLabel={<DeleteActionLabel />}
                />
              ),
            }}
          />
        ) : (
          <ProjectSheetLinkItem label={label} icon={<BlueLinkIcon />} href={url} key={index} />
        )
      }),
    [links, canEdit, handleDeleteLink]
  )

  return (
    <div>
      <ProjectSidebarSectionTitle text={t('project.sheet.general_info.links.title')} />
      <ProjectSectionsContainer>
        {items && items.length > 0 && (
          <ProjectInfoCardsContainer slim>
            <ProjectSheetLinkItem
              label={t('project.sheet.general_info.links.proposal_link')}
              icon={<BlueLinkIcon />}
              href={proposalUrl(proposalId)}
            />
            {items}
          </ProjectInfoCardsContainer>
        )}
        {canEdit && !showCreate && (
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
      <ConfirmationModal
        isLoading={isFormDisabled}
        isOpen={isDeleteConfirmationModalOpen}
        title={t('modal.delete_item.title')}
        description={t('modal.delete_item.description')}
        onPrimaryClick={handleDeleteLinkConfirm}
        onSecondaryClick={handleDeleteLinkCancel}
        onClose={handleDeleteLinkCancel}
        primaryButtonText={t('modal.delete_item.accept')}
        secondaryButtonText={t('modal.delete_item.reject')}
      />
    </div>
  )
}

export default ActionableLinksView
