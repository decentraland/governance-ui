import { ModalProps } from 'decentraland-ui/dist/components/Modal/Modal'

import useFormatMessage from '../../hooks/useFormatMessage'
import { ProposalAttributes } from '../../types/proposals'
import { getGoogleCalendarUrl } from '../../utils/projects'
import { proposalUrl } from '../../utils/proposal'

import ProposalPendingModal from './ProposalPendingModal'

interface Props {
  proposal: ProposalAttributes
}

export default function TenderPublishedModal({ proposal, ...props }: Props & ModalProps) {
  const t = useFormatMessage()

  return (
    <ProposalPendingModal
      title={t(`modal.proposal_pending.tender_title`)}
      description={t(`modal.proposal_pending.tender_description`)}
      calendarUrl={getGoogleCalendarUrl({
        title: t(`modal.proposal_pending.tender_calendar_title`, { title: proposal.title }),
        details: t(`modal.proposal_pending.tender_calendar_details`, {
          title: proposal.title,
          url: proposalUrl(proposal.id),
        }),
        startAt: proposal.start_at,
      })}
      votingStartsAt={proposal.start_at}
      {...props}
    />
  )
}
