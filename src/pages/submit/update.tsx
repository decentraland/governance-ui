import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Container } from 'decentraland-ui/dist/components/Container/Container'
import { SignIn } from 'decentraland-ui/dist/components/SignIn/SignIn'

import { Governance } from '../../clients/Governance'
import Text from '../../components/Common/Typography/Text'
import ContentLayout from '../../components/Layout/ContentLayout'
import ContentSection from '../../components/Layout/ContentSection'
import Head from '../../components/Layout/Head'
import LoadingView from '../../components/Layout/LoadingView'
import NotFound from '../../components/Layout/NotFound'
import PreventNavigation from '../../components/Layout/PreventNavigation.tsx'
import { EditUpdateModal } from '../../components/Modal/EditUpdateModal/EditUpdateModal'
import FinancialSection from '../../components/Updates/FinancialSection'
import GeneralSection from '../../components/Updates/GeneralSection'
import UpdateMarkdownView from '../../components/Updates/UpdateMarkdownView'
import { useAuthContext } from '../../context/AuthProvider'
import useDclFeatureFlags from '../../hooks/useDclFeatureFlags'
import useFormatMessage from '../../hooks/useFormatMessage'
import useProject from '../../hooks/useProject.ts'
import useProjectUpdate from '../../hooks/useProjectUpdate.ts'
import useProjectUpdates from '../../hooks/useProjectUpdates.ts'
import useURLSearchParams from '../../hooks/useURLSearchParams'
import useVestingContractData from '../../hooks/useVestingContractData'
import {
  GeneralUpdateSectionSchema,
  ProjectHealth,
  UpdateAttributes,
  UpdateFinancialSection,
  UpdateGeneralSection,
  UpdateStatus,
  UpdateSubmissionDetails,
} from '../../types/updates'
import { FeatureFlags } from '../../utils/features'
import { validateObjectMarkdownImages } from '../../utils/imageValidation.ts'
import locations from '../../utils/locations'
import { userModifiedForm } from '../../utils/proposal.ts'
import { getLatestUpdate, getReleases } from '../../utils/updates'

import './submit.css'
import './update.css'

interface Props {
  isEdit?: boolean
}

type UpdateValidationState = {
  generalSectionValid: boolean
  financialSectionValid: boolean
}

const NOW = new Date()

const intialValidationState: UpdateValidationState = {
  generalSectionValid: false,
  financialSectionValid: false,
}

const initialGeneralState: Partial<UpdateGeneralSection> | undefined = {
  additional_notes: '',
  blockers: '',
  health: ProjectHealth.OnTrack,
  highlights: '',
  introduction: '',
  next_steps: '',
}
const initialFinancialState: UpdateFinancialSection | undefined = { financial_records: [] }

function getInitialUpdateValues<T>(
  update: UpdateAttributes | null | undefined,
  isKey: (value: string) => boolean
): Partial<T> | undefined {
  if (!update) {
    return undefined
  }
  const values: Partial<T> = {}
  for (const key of Object.keys(update)) {
    if (isKey(key)) {
      const value = update[key as keyof UpdateAttributes]
      if (value) {
        values[key as keyof T] = value as never
      }
    }
  }
  return Object.keys(values).length > 0 ? values : undefined
}

export default function SubmitUpdatePage({ isEdit }: Props) {
  const t = useFormatMessage()
  const [account, accountState] = useAuthContext()
  const navigate = useNavigate()
  const preventNavigation = useRef(false)

  const [formDisabled, setFormDisabled] = useState(false)
  const params = useURLSearchParams()
  const updateId = params.get('id')
  const [isPreviewMode, setPreviewMode] = useState(false)
  const { update, isLoadingUpdate, isErrorOnUpdate } = useProjectUpdate(updateId)
  const projectId = useMemo(() => params.get('projectId') || update?.project_id || '', [update, params])
  const { project } = useProject(projectId)
  const { publicUpdates } = useProjectUpdates(projectId)
  const vestingAddresses = project?.vesting_addresses || []
  const { vestingData } = useVestingContractData(vestingAddresses)
  const [error, setError] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [generalSection, patchGeneralSection] = useState(initialGeneralState)
  const [financialSection, patchFinancialSection] = useState(initialFinancialState)
  const [csvInputField, patchCsvInputField] = useState<string | undefined>()
  const [validationState, patchValidationState] = useState<UpdateValidationState>(intialValidationState)
  const isValidToSubmit = Object.values(validationState).every((valid) => valid)
  const { isFeatureFlagEnabled } = useDclFeatureFlags()
  const isAuthDappEnabled = isFeatureFlagEnabled(FeatureFlags.AuthDapp)
  const queryClient = useQueryClient()

  useEffect(() => {
    preventNavigation.current =
      userModifiedForm(generalSection, initialGeneralState) || userModifiedForm(financialSection, initialFinancialState)
  }, [generalSection, financialSection])

  const releases = useMemo(() => (vestingData ? getReleases(vestingData) : undefined), [vestingData])

  const handleGeneralSectionValidation = useCallback(
    (data: UpdateGeneralSection, sectionValid: boolean) => {
      patchGeneralSection((prevState) => ({ ...prevState, ...data }))
      patchValidationState((prevState) => ({ ...prevState, generalSectionValid: sectionValid }))
    },
    [patchGeneralSection, patchValidationState]
  )

  const handleFinancialSectionValidation = useCallback(
    (data: UpdateFinancialSection | undefined, sectionValid: boolean) => {
      if (data) {
        patchFinancialSection((prevState) => ({ ...prevState, ...data }))
      }
      patchValidationState((prevState) => ({ ...prevState, financialSectionValid: sectionValid }))
    },
    [patchFinancialSection, patchValidationState]
  )

  const previewUpdate = useMemo(
    () => ({
      ...generalSection,
      ...financialSection,
      status: UpdateStatus.Pending,
      created_at: NOW,
      updated_at: NOW,
    }),
    [financialSection, generalSection]
  )

  const submitUpdate = async (data: UpdateGeneralSection & UpdateFinancialSection) => {
    if (!projectId) {
      return
    }

    preventNavigation.current = false
    setFormDisabled(true)

    const newUpdate: UpdateSubmissionDetails & UpdateGeneralSection & UpdateFinancialSection = {
      author: account!,
      health: data.health,
      introduction: data.introduction,
      highlights: data.highlights,
      blockers: data.blockers,
      next_steps: data.next_steps,
      additional_notes: data.additional_notes,
      financial_records: data.financial_records?.length ? data.financial_records : null,
    }

    const imageValidation = await validateObjectMarkdownImages(newUpdate)
    if (!imageValidation.isValid) {
      setError(
        t('error.invalid_images', {
          count: imageValidation.errors.length,
          urls: imageValidation.errors.join(', '),
        })
      )
      setFormDisabled(false)
      preventNavigation.current = true
      return
    }

    try {
      if (updateId) {
        await Governance.get().updateProjectUpdate(updateId, newUpdate)
        if (isEdit) {
          setIsEditModalOpen(false)
        }
      } else {
        await Governance.get().createProjectUpdate(projectId, newUpdate)
      }
      queryClient.invalidateQueries({
        queryKey: ['projectUpdates', projectId],
      })
      navigate(locations.proposal(project!.proposal_id, { newUpdate: 'true' }), { replace: true })
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
        setFormDisabled(false)
        preventNavigation.current = true
      }
    }
  }

  const onSubmit: SubmitHandler<UpdateGeneralSection & UpdateFinancialSection> = (data) => {
    if (isEdit) {
      setIsEditModalOpen(true)
    } else {
      submitUpdate(data)
    }
  }

  if (accountState.loading || (updateId && isLoadingUpdate)) {
    return <LoadingView />
  }

  const isDisabled = !isEdit && updateId && isErrorOnUpdate
  const isUserEnabledToEdit = update?.author === account

  if (isDisabled || (isEdit && !isUserEnabledToEdit)) {
    return (
      <ContentLayout>
        <NotFound />
      </ContentLayout>
    )
  }

  const title = t('page.proposal_update.title')
  const description = t('page.proposal_update.description')

  if (!account) {
    return (
      <Container>
        <Head title={title} description={description} />
        <SignIn
          isConnecting={accountState.selecting || accountState.loading}
          onConnect={isAuthDappEnabled ? accountState.authorize : accountState.select}
        />
      </Container>
    )
  }

  const handleEditModalClose = () => {
    setIsEditModalOpen(false)
    setFormDisabled(false)
  }

  const latestUpdate = getLatestUpdate(publicUpdates || [])

  return (
    <div>
      <ContentLayout>
        <Head title={title} description={description} />
        <ContentSection className="UpdateSubmit__HeaderContainer">
          <h1 className="UpdateSubmit__HeaderTitle">{title}</h1>
          <Text size="lg">{description}</Text>
        </ContentSection>
      </ContentLayout>
      {!isPreviewMode && (
        <>
          <GeneralSection
            isFormDisabled={formDisabled}
            intialValues={getInitialUpdateValues<UpdateGeneralSection>(
              update,
              (key) => key in GeneralUpdateSectionSchema.properties
            )}
            sectionNumber={1}
            onValidation={handleGeneralSectionValidation}
          />
          <FinancialSection
            isFormDisabled={formDisabled}
            sectionNumber={2}
            onValidation={handleFinancialSectionValidation}
            intialValues={getInitialUpdateValues<UpdateFinancialSection>(
              update,
              (key) => key in ({ financial_records: [] } as UpdateFinancialSection)
            )}
            releases={releases}
            latestUpdate={latestUpdate}
            csvInputField={csvInputField}
            setCSVInputField={patchCsvInputField}
          />
        </>
      )}
      <Container>
        {isPreviewMode && (
          <UpdateMarkdownView
            update={previewUpdate}
            vestingAddresses={project?.vesting_addresses}
            previousUpdate={latestUpdate}
          />
        )}
      </Container>
      <Container className="ContentLayout__Container">
        <ContentSection className="UpdateSubmit__Actions">
          <Button
            primary
            disabled={formDisabled || !isValidToSubmit}
            loading={formDisabled}
            onClick={() =>
              onSubmit({ ...generalSection, ...financialSection } as UpdateGeneralSection & UpdateFinancialSection)
            }
          >
            {t('page.proposal_update.publish_update')}
          </Button>
          <Button
            basic
            disabled={formDisabled}
            onClick={(e) => {
              e.preventDefault()
              setPreviewMode((prev) => !prev)
            }}
          >
            {isPreviewMode ? t('page.proposal_update.edit_update') : t('page.proposal_update.preview_update')}
          </Button>
        </ContentSection>
        {error && (
          <ContentSection>
            <Text size="lg" color="primary">
              {t(error) || error}
            </Text>
          </ContentSection>
        )}
      </Container>
      {isEdit && (
        <EditUpdateModal
          loading={formDisabled}
          open={isEditModalOpen}
          onClose={handleEditModalClose}
          onClickAccept={() =>
            submitUpdate({ ...generalSection, ...financialSection } as UpdateGeneralSection & UpdateFinancialSection)
          }
        />
      )}
      <PreventNavigation preventNavigation={preventNavigation.current} />
    </div>
  )
}
