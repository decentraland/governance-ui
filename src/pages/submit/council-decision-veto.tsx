import { useEffect, useMemo, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Header } from 'decentraland-ui/dist/components/Header/Header'

import { Governance } from '../../clients/Governance'
import Field from '../../components/Common/Form/Field'
import MarkdownField from '../../components/Common/Form/MarkdownField'
import SubLabel from '../../components/Common/SubLabel'
import Label from '../../components/Common/Typography/Label'
import Text from '../../components/Common/Typography/Text'
import ErrorMessage from '../../components/Error/ErrorMessage'
import ContentLayout, { ContentSection } from '../../components/Layout/ContentLayout'
import Head from '../../components/Layout/Head'
import LoadingView from '../../components/Layout/LoadingView'
import LogIn from '../../components/Layout/LogIn'
import CoAuthors from '../../components/Proposal/Submit/CoAuthor/CoAuthors'
import { SUBMISSION_THRESHOLD_COUNCIL_DECISION_VETO } from '../../constants/proposals'
import { useAuthContext } from '../../context/AuthProvider'
import useFormatMessage from '../../hooks/useFormatMessage'
import useVotingPowerDistribution from '../../hooks/useVotingPowerDistribution'
import {
  NewProposalCouncilDecisionVeto,
  ProposalType,
  newProposalCouncilDecisionVetoScheme,
} from '../../types/proposals'
import locations from '../../utils/locations'
import { getSnapshotIdFromUrl } from '../../utils/proposal'

import './council-decision-veto.css'
import './submit.css'

const initialState: NewProposalCouncilDecisionVeto = {
  decision_snapshot_id: '',
  reasons: '',
  suggestions: '',
}

const schema = newProposalCouncilDecisionVetoScheme.properties

export default function SubmitCouncilDecisionVeto() {
  const t = useFormatMessage()
  const [account, accountState] = useAuthContext()
  const {
    handleSubmit,
    formState: { isDirty, isSubmitting, errors },
    control,
    setValue,
    watch,
  } = useForm<NewProposalCouncilDecisionVeto>({ defaultValues: initialState, mode: 'onTouched' })
  const { vpDistribution, isLoadingVpDistribution } = useVotingPowerDistribution(account)
  const submissionVpNotMet = useMemo(
    () => !!vpDistribution && vpDistribution.total < Number(SUBMISSION_THRESHOLD_COUNCIL_DECISION_VETO),
    [vpDistribution]
  )
  console.log('submissionVpNotMet', submissionVpNotMet, SUBMISSION_THRESHOLD_COUNCIL_DECISION_VETO)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const [formDisabled, setFormDisabled] = useState(false)
  const preventNavigation = useRef(false)

  const setCoAuthors = (addresses?: string[]) => setValue('coAuthors', addresses)

  useEffect(() => {
    preventNavigation.current = isDirty && !isSubmitting
  }, [isDirty, isSubmitting])

  const onSubmit: SubmitHandler<NewProposalCouncilDecisionVeto> = async (data) => {
    setFormDisabled(true)

    const { suggestions, decision_snapshot_id, ...rest } = data

    try {
      const proposal = await Governance.get().createProposalCouncilDecisionVeto({
        decision_snapshot_id: getSnapshotIdFromUrl(decision_snapshot_id),
        suggestions: suggestions || undefined,
        ...rest,
      })
      navigate(locations.proposal(proposal.id, { new: 'true' }), { replace: true })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.body?.error || error.message)
      setFormDisabled(false)
    }
  }

  if (accountState.loading) {
    return <LoadingView />
  }

  if (!account) {
    return <LogIn title={t('page.submit_ban_name.title')} description={t('page.submit_ban_name.description')} />
  }

  return (
    <ContentLayout small preventNavigation={preventNavigation.current} navigateBackUrl="/submit">
      <Head
        title={t('page.submit_council_decision_veto.title')}
        description={t('page.submit_council_decision_veto.description')}
        links={[{ rel: 'canonical', href: locations.submit(ProposalType.CouncilDecisionVeto) }]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ContentSection>
          <Header size="huge">{t('page.submit_council_decision_veto.title')}</Header>
        </ContentSection>
        <ContentSection>
          <Text size="lg">{t('page.submit_council_decision_veto.description')}</Text>
        </ContentSection>
        <ContentSection>
          <Label>{t('page.submit_council_decision_veto.decision_snapshot_id_label')}</Label>
          <SubLabel>{t('page.submit_council_decision_veto.decision_snapshot_id_detail')}</SubLabel>
          <Field
            name="decision_snapshot_id"
            placeholder={t('page.submit_council_decision_veto.decision_snapshot_id_placeholder')}
            control={control}
            error={!!errors.decision_snapshot_id}
            rules={{
              required: { value: true, message: t('error.council_decision_veto.decision_snapshot_id_empty') },
            }}
            message={t(errors.decision_snapshot_id?.message)}
            disabled={formDisabled || submissionVpNotMet}
            loading={isLoadingVpDistribution}
          />
        </ContentSection>
        <ContentSection>
          <Label>{t('page.submit_council_decision_veto.reasons_label')}</Label>
          <SubLabel>{t('page.submit_council_decision_veto.reasons_detail')}</SubLabel>

          <MarkdownField
            control={control}
            name="reasons"
            rules={{
              required: { value: true, message: t('error.council_decision_veto.reasons_empty') },
              minLength: {
                value: schema.reasons.minLength,
                message: t('error.council_decision_veto.reasons_too_short'),
              },
              maxLength: {
                value: schema.reasons.maxLength,
                message: t('error.council_decision_veto.reasons_too_large'),
              },
            }}
            disabled={formDisabled || submissionVpNotMet || isLoadingVpDistribution}
            error={!!errors.reasons}
            message={
              t(errors.reasons?.message) +
              ' ' +
              t('page.submit.character_counter', {
                current: watch('reasons').length,
                limit: schema.reasons.maxLength,
              })
            }
          />
        </ContentSection>
        <ContentSection>
          <div className="CouncilDecisionVeto__LabelContainer">
            <Label>{t('page.submit_council_decision_veto.suggestions_label')}</Label>
            <sup className="Optional">{t('page.submit.optional_tooltip')}</sup>
          </div>
          <SubLabel>{t('page.submit_council_decision_veto.suggestions_detail')}</SubLabel>
          <MarkdownField
            control={control}
            name="suggestions"
            rules={{
              required: { value: false, message: t('error.council_decision_veto.suggestions_empty') },
              minLength: {
                value: schema.suggestions.minLength,
                message: t('error.council_decision_veto.suggestions_too_short'),
              },
              maxLength: {
                value: schema.suggestions.maxLength,
                message: t('error.council_decision_veto.suggestions_too_large'),
              },
            }}
            disabled={formDisabled || submissionVpNotMet || isLoadingVpDistribution}
            error={!!errors.suggestions}
            message={
              t(errors.suggestions?.message) +
              ' ' +
              t('page.submit.character_counter', {
                current: watch('suggestions')?.length || 0,
                limit: schema.suggestions.maxLength,
              })
            }
          />
        </ContentSection>
        <ContentSection>
          <CoAuthors
            setCoAuthors={setCoAuthors}
            isDisabled={formDisabled || submissionVpNotMet || isLoadingVpDistribution}
          />
        </ContentSection>
        <ContentSection>
          <Button primary type="submit" disabled={formDisabled} loading={isSubmitting}>
            {t('page.submit.button_submit')}
          </Button>
        </ContentSection>
        {submissionVpNotMet && (
          <ContentSection>
            <Text size="lg" color="primary">
              {t('error.council_decision_veto.submission_vp_not_met', {
                threshold: SUBMISSION_THRESHOLD_COUNCIL_DECISION_VETO,
              })}
            </Text>
          </ContentSection>
        )}
        {error && (
          <ContentSection>
            <ErrorMessage label={t('page.submit.error_label')} errorMessage={t(error) || error} />
          </ContentSection>
        )}
      </form>
    </ContentLayout>
  )
}
