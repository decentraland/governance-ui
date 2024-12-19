import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Container } from 'decentraland-ui/dist/components/Container/Container'
import camelCase from 'lodash/camelCase'

import { Governance } from '../../clients/Governance'
import Markdown from '../../components/Common/Typography/Markdown'
import Text from '../../components/Common/Typography/Text'
import ErrorMessage from '../../components/Error/ErrorMessage'
import GrantRequestCategorySection from '../../components/GrantRequest/GrantRequestCategorySection'
import GrantRequestDueDiligenceSection, {
  INITIAL_GRANT_REQUEST_DUE_DILIGENCE_STATE,
} from '../../components/GrantRequest/GrantRequestDueDiligenceSection'
import GrantRequestFinalConsentSection from '../../components/GrantRequest/GrantRequestFinalConsentSection'
import GrantRequestFundingSection, {
  INITIAL_GRANT_REQUEST_FUNDING_STATE,
} from '../../components/GrantRequest/GrantRequestFundingSection'
import GrantRequestGeneralInfoSection, {
  INITIAL_GRANT_REQUEST_GENERAL_INFO_STATE,
} from '../../components/GrantRequest/GrantRequestGeneralInfoSection'
import GrantRequestTeamSection, {
  INITIAL_GRANT_REQUEST_TEAM_STATE,
} from '../../components/GrantRequest/GrantRequestTeamSection'
import DecentralandLogo from '../../components/Icon/DecentralandLogo'
import { ContentSection } from '../../components/Layout/ContentLayout'
import Head from '../../components/Layout/Head'
import LoadingView from '../../components/Layout/LoadingView'
import LogIn from '../../components/Layout/LogIn'
import PreventNavigation from '../../components/Layout/PreventNavigation.tsx'
import CategorySelector from '../../components/Projects/CategorySelector'
import { GRANT_PROPOSAL_SUBMIT_ENABLED } from '../../constants/index.ts'
import { SUBMISSION_THRESHOLD_GRANT } from '../../constants/proposals'
import { useAuthContext } from '../../context/AuthProvider'
import useFormatMessage from '../../hooks/useFormatMessage'
import useProjectRequestSectionNumber from '../../hooks/useProjectRequestSectionNumber'
import useVotingPowerDistribution from '../../hooks/useVotingPowerDistribution'
import {
  GrantRequest,
  GrantRequestCategoryAssessment,
  GrantRequestFunding,
  GrantRequestGeneralInfo,
  NewGrantCategory,
  VALID_CATEGORIES,
} from '../../types/grants'
import { ProposalType } from '../../types/proposals'
import { validateObjectMarkdownImages } from '../../utils/imageValidation.ts'
import locations from '../../utils/locations'
import { asNumber, isGrantProposalSubmitEnabled, userModifiedForm } from '../../utils/proposal'
import { toNewGrantCategory } from '../../utils/quarterCategoryBudget'

import './grant.css'
import './submit.css'

const initialState: GrantRequest = {
  category: null,
  ...INITIAL_GRANT_REQUEST_FUNDING_STATE,
  ...INITIAL_GRANT_REQUEST_GENERAL_INFO_STATE,
  ...INITIAL_GRANT_REQUEST_TEAM_STATE,
  ...INITIAL_GRANT_REQUEST_DUE_DILIGENCE_STATE,
}

export type GrantRequestValidationState = {
  fundingSectionValid: boolean
  generalInformationSectionValid: boolean
  categoryAssessmentSectionValid: boolean
  finalConsentSectionValid: boolean
  dueDiligenceSectionValid: boolean
  teamSectionValid: boolean
}

const initialValidationState: GrantRequestValidationState = {
  fundingSectionValid: false,
  generalInformationSectionValid: false,
  categoryAssessmentSectionValid: false,
  finalConsentSectionValid: false,
  dueDiligenceSectionValid: false,
  teamSectionValid: false,
}

function parseStringsAsNumbers(grantRequest: GrantRequest) {
  grantRequest.funding = asNumber(grantRequest.funding)

  if (grantRequest.accelerator) {
    grantRequest.accelerator.investmentRecoveryTime = asNumber(grantRequest.accelerator.investmentRecoveryTime)
  }
  if (grantRequest.documentation) {
    grantRequest.documentation.totalPieces = asNumber(grantRequest.documentation?.totalPieces)
  }
  if (grantRequest.inWorldContent) {
    grantRequest.inWorldContent.totalPieces = asNumber(grantRequest.inWorldContent.totalPieces)
    grantRequest.inWorldContent.totalUsers = asNumber(grantRequest.inWorldContent.totalUsers)
  }
  if (grantRequest.socialMediaContent) {
    grantRequest.socialMediaContent.totalPieces = asNumber(grantRequest.socialMediaContent.totalPieces)
    grantRequest.socialMediaContent.totalPeopleImpact = asNumber(grantRequest.socialMediaContent.totalPeopleImpact)
  }
  if (grantRequest.sponsorship) {
    grantRequest.sponsorship.totalEvents = asNumber(grantRequest.sponsorship.totalEvents)
    grantRequest.sponsorship.totalAttendance = asNumber(grantRequest.sponsorship.totalAttendance)
  }
}

export default function SubmitGrant() {
  const t = useFormatMessage()
  const [account, accountState] = useAuthContext()
  const navigate = useNavigate()

  if (!GRANT_PROPOSAL_SUBMIT_ENABLED) {
    navigate('/submit')
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    let category: NewGrantCategory | null = null
    try {
      const categoryParam = params.get('category')
      if (categoryParam) {
        category = toNewGrantCategory(categoryParam)
      }
    } catch (error) {
      console.error(error)
    } finally {
      if (category && VALID_CATEGORIES.includes(category)) {
        patchGrantRequest((prevState) => ({ ...prevState, category }))
      } else {
        navigate('/submit/grant')
      }
    }
  }, [navigate])

  const [grantRequest, patchGrantRequest] = useState<GrantRequest>(initialState)
  const [validationState, setValidationState] = useState<GrantRequestValidationState>(initialValidationState)
  const [isFormDisabled, setIsFormDisabled] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const allSectionsValid = Object.values(validationState).every((prop) => prop)
  const isCategorySelected = grantRequest.category !== null
  const preventNavigation = useRef(false)
  const [submitError, setSubmitError] = useState<string | undefined>(undefined)
  const { getSectionNumber } = useProjectRequestSectionNumber()
  const { vpDistribution } = useVotingPowerDistribution(account)
  const submissionVpNotMet = !!vpDistribution && vpDistribution.total < Number(SUBMISSION_THRESHOLD_GRANT)

  useEffect(() => {
    preventNavigation.current = userModifiedForm(grantRequest, initialState)
  }, [grantRequest])

  const handleCancel = () => {
    navigate(locations.submit())
  }

  if (!isGrantProposalSubmitEnabled(Date.now())) {
    navigate('/submit')
  }

  const submit = useCallback(async () => {
    if (allSectionsValid) {
      preventNavigation.current = false
      setIsFormDisabled(true)

      const imageValidation = await validateObjectMarkdownImages(grantRequest)
      if (!imageValidation.isValid) {
        setSubmitError(
          t('error.invalid_images', {
            count: imageValidation.errors.length,
            urls: imageValidation.errors.join(', '),
          })
        )
        setIsFormDisabled(false)
        preventNavigation.current = true
        return
      }

      Promise.resolve()
        .then(async () => {
          parseStringsAsNumbers(grantRequest)
          return Governance.get().createProposalGrant(grantRequest)
        })
        .then((proposal) => {
          navigate(locations.proposal(proposal.id, { new: 'true' }), { replace: true })
        })
        .catch((err) => {
          console.error(err, { ...err })
          setSubmitError(err.body?.error || err.message)
          setIsFormDisabled(false)
          preventNavigation.current = true
        })
    }
  }, [allSectionsValid, grantRequest, navigate])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const onScroll = function () {
        if (window.scrollY > 100) {
          setHasScrolled(true)
        }

        if (window.scrollY <= 100) {
          setHasScrolled(false)
        }
      }

      window.addEventListener('scroll', onScroll)

      return () => window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleGeneralInfoSectionValidation = useCallback((data: GrantRequestGeneralInfo, sectionValid: boolean) => {
    patchGrantRequest((prevState) => ({ ...prevState, ...data }))
    setValidationState((prevState) => ({ ...prevState, generalInformationSectionValid: sectionValid }))
  }, [])

  const handleFundingSectionValidation = useCallback((data: GrantRequestFunding, sectionValid: boolean) => {
    patchGrantRequest((prevState) => ({ ...prevState, ...data }))
    setValidationState((prevState) => ({ ...prevState, fundingSectionValid: sectionValid }))
  }, [])

  const handleCategorySection = useCallback((data: GrantRequestCategoryAssessment, sectionValid: boolean) => {
    patchGrantRequest((prevState) => ({ ...prevState, ...data }))
    setValidationState((prevState) => ({ ...prevState, categoryAssessmentSectionValid: sectionValid }))
  }, [])

  if (accountState.loading) {
    return <LoadingView />
  }

  const title = t('page.submit_grant.title')
  const description = t('page.submit_grant.description', { threshold: SUBMISSION_THRESHOLD_GRANT })

  if (!account) {
    return <LogIn title={title} description={description} />
  }

  return (
    <div>
      <Head
        title={title}
        description={description}
        links={[{ rel: 'canonical', href: locations.submit(ProposalType.Grant) }]}
      />
      <Container className="GrantRequest__Head">
        <div className="GrantRequest__Header">
          <DecentralandLogo
            className={classNames('GrantRequest__Logo', hasScrolled && 'GrantRequest__Logo--visible')}
          />
          <h1 className="GrantRequest_HeaderTitle">{title}</h1>
        </div>
        <Button basic className="GrantRequest__CancelButton" onClick={handleCancel}>
          {t('page.submit_grant.cancel')}
        </Button>
      </Container>
      <Container className="ProjectRequestSection__Container">
        <Markdown componentsClassNames={{ p: 'GrantRequest__HeaderDescription' }}>{description}</Markdown>
      </Container>
      {!isCategorySelected && (
        <Container className="ProjectRequestSection__Container">
          <CategorySelector
            onCategoryClick={(value: NewGrantCategory) => {
              patchGrantRequest((prevState) => ({ ...prevState, category: value }))
              setValidationState((prevState) => ({
                ...prevState,
                categoryAssessmentSectionValid: value === NewGrantCategory.Platform,
              }))
              navigate(locations.submit(ProposalType.Grant, { category: value }), { replace: true })
            }}
          />
        </Container>
      )}
      {isCategorySelected && (
        <>
          <GrantRequestFundingSection
            grantCategory={grantRequest.category}
            onCategoryChange={(category: NewGrantCategory) => {
              patchGrantRequest((prevState) => {
                const formattedCategory = camelCase(category) as keyof GrantRequestCategoryAssessment
                delete prevState[formattedCategory]
                return { ...prevState, category: null }
              })
              navigate(locations.submit(ProposalType.Grant), { replace: true })
            }}
            onValidation={handleFundingSectionValidation}
            isFormDisabled={isFormDisabled || submissionVpNotMet}
            sectionNumber={getSectionNumber()}
          />

          <GrantRequestGeneralInfoSection
            onValidation={handleGeneralInfoSectionValidation}
            isFormDisabled={isFormDisabled || submissionVpNotMet}
            sectionNumber={getSectionNumber()}
          />

          <GrantRequestTeamSection
            onValidation={(data, sectionValid) => {
              patchGrantRequest((prevState) => ({ ...prevState, ...data }))
              setValidationState((prevState) => ({ ...prevState, teamSectionValid: sectionValid }))
            }}
            sectionNumber={getSectionNumber()}
            isDisabled={isFormDisabled || submissionVpNotMet}
          />

          <GrantRequestDueDiligenceSection
            funding={Number(grantRequest.funding)}
            onValidation={(data, sectionValid) => {
              patchGrantRequest((prevState) => ({ ...prevState, ...data }))
              setValidationState((prevState) => ({ ...prevState, dueDiligenceSectionValid: sectionValid }))
            }}
            sectionNumber={getSectionNumber()}
            projectDuration={grantRequest.projectDuration}
            isDisabled={isFormDisabled || submissionVpNotMet}
          />

          {grantRequest.category && (
            <GrantRequestCategorySection
              category={grantRequest.category}
              onValidation={handleCategorySection}
              isFormDisabled={isFormDisabled || submissionVpNotMet}
              sectionNumber={getSectionNumber()}
            />
          )}

          <GrantRequestFinalConsentSection
            category={grantRequest.category}
            onValidation={(sectionValid) =>
              setValidationState((prevState) => ({ ...prevState, finalConsentSectionValid: sectionValid }))
            }
            isFormDisabled={isFormDisabled || submissionVpNotMet}
            sectionNumber={getSectionNumber()}
          />

          <Container className="ContentLayout__Container">
            <ContentSection className="ProjectRequestSection__Content">
              <div>
                <Button
                  primary
                  disabled={!allSectionsValid || isFormDisabled || submissionVpNotMet}
                  loading={isFormDisabled}
                  onClick={submit}
                >
                  {t('page.submit.button_submit')}
                </Button>
              </div>
            </ContentSection>
          </Container>
          <Container className="ContentLayout__Container">
            {submissionVpNotMet && (
              <ContentSection className="ProjectRequestSection__Content">
                <Text className="GrantRequest__SubmissionVpNotMetText" size="lg" color="primary">
                  {t('error.grant.submission_vp_not_met', { threshold: SUBMISSION_THRESHOLD_GRANT })}
                </Text>
              </ContentSection>
            )}
          </Container>
        </>
      )}
      {!!submitError && (
        <Container className="GrantRequest__Error">
          <ContentSection>
            <ErrorMessage label={t('page.submit.error_label')} errorMessage={t(submitError) || submitError} />
          </ContentSection>
        </Container>
      )}

      <PreventNavigation preventNavigation={preventNavigation.current} />
    </div>
  )
}
