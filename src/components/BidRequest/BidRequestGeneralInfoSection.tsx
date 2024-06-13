import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { MILESTONE_SUBMIT_LIMIT } from '../../constants/proposals'
import useFormatMessage from '../../hooks/useFormatMessage'
import { BidRequestGeneralInfo, BidRequestGeneralInfoSchema } from '../../types/bids'
import { Milestone } from '../../types/grants'
import Field from '../Common/Form/Field'
import MarkdownField from '../Common/Form/MarkdownField'
import SubLabel from '../Common/SubLabel'
import Label from '../Common/Typography/Label'
import AddBox from '../GrantRequest/AddBox'
import AddMilestoneModal from '../GrantRequest/AddMilestoneModal'
import BreakdownItem from '../GrantRequest/BreakdownItem'
import { ContentSection } from '../Layout/ContentLayout'
import ProjectRequestSection from '../ProjectRequest/ProjectRequestSection'
import CoAuthors from '../Proposal/Submit/CoAuthor/CoAuthors'

export const INITIAL_BID_REQUEST_GENERAL_INFO_STATE: BidRequestGeneralInfo = {
  teamName: '',
  deliverables: '',
  roadmap: '',
  milestones: [],
}

const schema = BidRequestGeneralInfoSchema

interface Props {
  onValidation: (data: BidRequestGeneralInfo, sectionValid: boolean) => void
  isFormDisabled: boolean
  sectionNumber: number
}

export default function BidRequestGeneralInfoSection({ onValidation, isFormDisabled, sectionNumber }: Props) {
  const t = useFormatMessage()
  const {
    formState: { isValid, errors, isDirty },
    control,
    setValue,
    watch,
  } = useForm<BidRequestGeneralInfo>({
    defaultValues: INITIAL_BID_REQUEST_GENERAL_INFO_STATE,
    mode: 'onTouched',
  })
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false)

  const values = useWatch({ control })
  const hasReachedMilestoneLimit = values.milestones && values.milestones.length === MILESTONE_SUBMIT_LIMIT

  useEffect(() => {
    onValidation({ ...(values as BidRequestGeneralInfo) }, isValid)
  }, [values, isValid, onValidation])

  return (
    <ProjectRequestSection
      validated={isValid}
      isFormEdited={isDirty}
      sectionTitle={t('page.submit_bid.general_info.title')}
      sectionNumber={sectionNumber}
    >
      <ContentSection className="ProjectRequestSection__Field">
        <Label>{t('page.submit_bid.general_info.team_name_label')}</Label>
        <Field
          name="teamName"
          control={control}
          error={!!errors.teamName}
          message={
            (errors.teamName?.message || '') +
            ' ' +
            t('page.submit.character_counter', {
              current: watch('teamName').length,
              limit: schema.teamName.maxLength,
            })
          }
          disabled={isFormDisabled}
          rules={{
            required: { value: true, message: t('error.bid.general_info.team_name_empty') },
            minLength: {
              value: schema.teamName.minLength,
              message: t('error.bid.general_info.team_name_too_short'),
            },
            maxLength: {
              value: schema.teamName.maxLength,
              message: t('error.bid.general_info.team_name_too_large'),
            },
          }}
        />
      </ContentSection>
      <ContentSection className="ProjectRequestSection__Field">
        <Label>{t('page.submit_bid.general_info.deliverables_label')}</Label>
        <SubLabel>{t('page.submit_bid.general_info.deliverables_detail')}</SubLabel>
        <MarkdownField
          name="deliverables"
          control={control}
          error={!!errors.deliverables}
          message={
            (errors.deliverables?.message || '') +
            ' ' +
            t('page.submit.character_counter', {
              current: watch('deliverables').length,
              limit: schema.deliverables.maxLength,
            })
          }
          disabled={isFormDisabled}
          rules={{
            required: { value: true, message: t('error.bid.general_info.deliverables_empty') },
            minLength: {
              value: schema.deliverables.minLength,
              message: t('error.bid.general_info.deliverables_too_short'),
            },
            maxLength: {
              value: schema.deliverables.maxLength,
              message: t('error.bid.general_info.deliverables_too_large'),
            },
          }}
        />
      </ContentSection>
      <ContentSection className="ProjectRequestSection__Field">
        <Label>{t('page.submit_bid.general_info.roadmap_label')}</Label>
        <SubLabel>{t('page.submit_bid.general_info.roadmap_detail')}</SubLabel>
        <MarkdownField
          name="roadmap"
          control={control}
          error={!!errors.roadmap}
          message={
            (errors.roadmap?.message || '') +
            ' ' +
            t('page.submit.character_counter', {
              current: watch('roadmap').length,
              limit: schema.roadmap.maxLength,
            })
          }
          disabled={isFormDisabled}
          rules={{
            required: { value: true, message: t('error.bid.general_info.roadmap_empty') },
            minLength: {
              value: schema.roadmap.minLength,
              message: t('error.bid.general_info.roadmap_too_short'),
            },
            maxLength: {
              value: schema.roadmap.maxLength,
              message: t('error.bid.general_info.roadmap_too_large'),
            },
          }}
        />
      </ContentSection>
      <ContentSection className="ProjectRequestSection__Field">
        <Label>{t('page.submit_grant.general_info.milestone_label')}</Label>
        <SubLabel>{t('page.submit_grant.general_info.milestone_detail')}</SubLabel>
        {values.milestones &&
          values.milestones.length > 0 &&
          values.milestones.map((item, index) => (
            <BreakdownItem
              key={`${item.title}-${index}`}
              title={`${item.delivery_date!} - ${item.title!}`}
              subtitle={item.tasks!}
              onClick={() => {
                setSelectedMilestone(item as Milestone)
                setIsMilestoneModalOpen(true)
              }}
            />
          ))}
        <AddBox disabled={hasReachedMilestoneLimit || isFormDisabled} onClick={() => setIsMilestoneModalOpen(true)}>
          {hasReachedMilestoneLimit
            ? t('page.submit_grant.general_info.milestone_button_limit')
            : t('page.submit_grant.general_info.milestone_button')}
        </AddBox>
      </ContentSection>
      <ContentSection>
        <CoAuthors
          setCoAuthors={(addresses?: string[]) => setValue('coAuthors', addresses)}
          isDisabled={isFormDisabled}
        />
      </ContentSection>
      {isMilestoneModalOpen && (
        <AddMilestoneModal
          isOpen={isMilestoneModalOpen}
          onClose={() => {
            if (selectedMilestone) {
              setSelectedMilestone(null)
            }
            setIsMilestoneModalOpen(false)
          }}
          onSubmit={(item: Milestone) => {
            if (selectedMilestone) {
              const replaceEditedItem = (i: Milestone) => (i.title === selectedMilestone.title ? item : i)
              const value = (values.milestones as Milestone[]).map(replaceEditedItem)
              setValue('milestones', value)
              setSelectedMilestone(null)
            } else {
              const value = [...(values.milestones as Milestone[]), item]
              setValue('milestones', value)
            }
          }}
          onDelete={() => {
            if (selectedMilestone) {
              const value = (values.milestones as Milestone[]).filter((i) => i.title !== selectedMilestone.title)
              setValue('milestones', value)
              setIsMilestoneModalOpen(false)
            }
          }}
          selectedMilestone={selectedMilestone}
        />
      )}
    </ProjectRequestSection>
  )
}
