import { useMemo } from 'react'

import { Mobile, NotMobile } from 'decentraland-ui/dist/components/Media/Media'

import useFormatMessage from '../../hooks/useFormatMessage'
import useParticipation from '../../hooks/useParticipation'
import useProposals from '../../hooks/useProposals'
import { useTransparencyBalances } from '../../hooks/useTransparency'
import { ProposalStatus } from '../../types/proposals'
import locations from '../../utils/locations'

import MetricsCard from './MetricsCard'
import './MetricsCards.css'

const MetricsCards = () => {
  const t = useFormatMessage()

  const { data: balancesData, isLoadingTransparencyBalances } = useTransparencyBalances()

  const treasuryAmount = useMemo(() => {
    if (!balancesData) return 0
    const total = balancesData.reduce((acc, obj) => acc + Number(obj.amount) * obj.rate, 0)
    return total.toFixed(2)
  }, [balancesData])

  const { proposals: endingSoonProposals, isLoadingProposals: isLoadingEndingSoonProposals } = useProposals({
    status: ProposalStatus.Active,
    timeFrame: '2days',
    timeFrameKey: 'finish_at',
  })

  const { proposals: activeProposals, isLoadingProposals: isLoadingActiveProposals } = useProposals({
    status: ProposalStatus.Active,
  })

  const { participation, isLoadingParticipation } = useParticipation()

  const content = [
    <MetricsCard
      href={locations.proposals()}
      key="page.home.metrics.active_proposals"
      isLoading={isLoadingActiveProposals || isLoadingEndingSoonProposals}
      loadingLabel={t('page.home.metrics.fetching_proposals_data')}
      category={t('page.home.metrics.proposals')}
      title={t('page.home.metrics.active_proposals', { value: activeProposals?.total })}
      description={t('page.home.metrics.ending_soon', { value: endingSoonProposals?.total })}
    />,
    <MetricsCard
      href="/#engagement"
      key="page.home.metrics.votes_this_week"
      isLoading={isLoadingParticipation}
      loadingLabel={t('page.home.metrics.fetching_participation_data')}
      category={t('page.home.metrics.participation')}
      title={t('page.home.metrics.votes_this_week', { value: participation?.lastWeek })}
      description={t('page.home.metrics.votes_last_month', { value: participation?.last30Days })}
    />,
    <MetricsCard
      href={locations.transparency()}
      key="page.home.metrics.treasury_amount"
      isLoading={isLoadingTransparencyBalances}
      loadingLabel={t('page.home.metrics.fetching_treasury_data')}
      category={t('page.home.metrics.treasury')}
      title={`$${t('general.number', { value: treasuryAmount })}`}
      description={t('page.home.metrics.consolidated')}
    />,
  ]

  return (
    <>
      <Mobile>
        <div className="MetricsCards__Carousel">{content}</div>
      </Mobile>
      <NotMobile>
        <div className="MetricsCards">{content}</div>
      </NotMobile>
    </>
  )
}

export default MetricsCards
