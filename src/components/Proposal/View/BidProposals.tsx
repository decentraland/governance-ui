import useFormatMessage from '../../../hooks/useFormatMessage'
import { ProposalAttributes } from '../../../types/proposals'

import ProposalCard from './ProposalCard'
import './ProposalProcess.css'
import Section from './Section'

interface Props {
  proposals: ProposalAttributes[]
}

export default function BidProposals({ proposals }: Props) {
  const t = useFormatMessage()

  return (
    <Section title={t('page.proposal_bidding_tendering.submitted_bid_proposals')} isNew>
      {proposals.map((proposal) => {
        return <ProposalCard key={proposal.id} proposal={proposal} />
      })}
    </Section>
  )
}
