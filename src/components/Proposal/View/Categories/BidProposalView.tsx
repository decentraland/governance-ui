import { useIntl } from 'react-intl'

import { CURRENCY_FORMAT_OPTIONS } from '../../../../helpers'
import useFormatMessage from '../../../../hooks/useFormatMessage'
import useProposal from '../../../../hooks/useProposal'
import { BidRequest } from '../../../../types/bids'
import type { ProposalAttributes } from '../../../../types/proposals'
import Time from '../../../../utils/date/Time'
import { proposalUrl } from '../../../../utils/proposal'
import BudgetBreakdownView from '../../../GrantRequest/BudgetBreakdownView'
import MilestonesView from '../../../GrantRequest/MilestonesView'
import PersonnelView from '../../../GrantRequest/PersonnelView'
import ProposalDescriptionItem from '../ProposalDescriptionItem'

interface Props {
  config: BidRequest
}

function getLinkedProposalLink(proposal: ProposalAttributes | null) {
  if (!proposal) {
    return ''
  }

  return `[${proposal.title}](${proposalUrl(proposal.id)})`
}

const formatDate = (date: Date | string) => Time.from(date).format('MMM DD, YYYY')

function BidProposalView({ config }: Props) {
  const t = useFormatMessage()
  const intl = useIntl()
  const {
    funding,
    projectDuration,
    deliveryDate,
    beneficiary,
    email,
    deliverables,
    roadmap,
    milestones,
    members,
    budgetBreakdown,
    linked_proposal_id,
  } = config

  const amount = intl.formatNumber(Number(funding), CURRENCY_FORMAT_OPTIONS)
  const { proposal: linkedProposal } = useProposal(linked_proposal_id)

  return (
    <div>
      <ProposalDescriptionItem body={t('page.proposal_view.bid.header')} />
      <ProposalDescriptionItem
        title={t('page.proposal_view.bid.linked_tender_title')}
        body={getLinkedProposalLink(linkedProposal)}
      />
      <ProposalDescriptionItem
        title={t('page.proposal_view.bid.budget_title')}
        body={t('page.proposal_view.bid.budget_body', { amount })}
      />
      <ProposalDescriptionItem
        title={t('page.proposal_view.bid.duration_title')}
        body={t('page.proposal_view.bid.duration_body', { duration: projectDuration })}
      />
      <ProposalDescriptionItem
        title={t('page.proposal_view.bid.delivery_date_title')}
        body={formatDate(deliveryDate)}
      />
      <ProposalDescriptionItem
        title={t('page.proposal_view.bid.beneficiary_title')}
        body={beneficiary}
        className="ProposalMarkdown__BreakAnywhere"
      />
      <ProposalDescriptionItem title={t('page.proposal_view.bid.email_title')} body={email} />
      <ProposalDescriptionItem title={t('page.proposal_view.bid.deliverables_title')} body={deliverables} />
      <ProposalDescriptionItem title={t('page.proposal_view.bid.roadmap_title')} body={roadmap} />
      {milestones && <MilestonesView milestones={milestones} />}
      <BudgetBreakdownView breakdown={budgetBreakdown} />
      <PersonnelView members={members} />
    </div>
  )
}

export default BidProposalView
