import { useMemo } from 'react'

import useFormatMessage from '../../hooks/useFormatMessage'
import { Milestone } from '../../types/grants'
import ProposalMarkdown from '../Proposal/View/ProposalMarkdown'

import BreakdownAccordion from './BreakdownAccordion'
import BreakdownContent from './BreakdownContent'

interface Props {
  milestones: Milestone[]
}

function MilestonesView({ milestones }: Props) {
  const t = useFormatMessage()
  const items = useMemo(
    () =>
      milestones.map(({ title, description, delivery_date }) => ({
        title: `${delivery_date} - ${title}`,
        subtitle: description,
        content: <BreakdownContent description={description} />,
      })),
    [milestones]
  )
  return (
    <>
      <ProposalMarkdown text={`## ${t('page.proposal_view.grant.milestones_title')}`} />
      <BreakdownAccordion items={items} />
    </>
  )
}

export default MilestonesView
