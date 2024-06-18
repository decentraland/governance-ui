import { useAuthContext } from '../../context/AuthProvider'
import useFormatMessage from '../../hooks/useFormatMessage'
import usePriorityProposals from '../../hooks/usePriorityProposals'
import PriorityProposalsBox from '../Profile/PriorityProposalsBox'

import HomeSectionHeader from './HomeSectionHeader'
import './UpcomingOpportunities.css'

const UpcomingOpportunities = () => {
  const t = useFormatMessage()
  const [userAddress] = useAuthContext()
  const { priorityProposals, isLoading } = usePriorityProposals(userAddress?.toLowerCase())

  if (!priorityProposals || priorityProposals.length === 0) {
    return null
  }

  return (
    <div className="UpcomingOpportunities">
      <HomeSectionHeader
        title={t('page.home.priority_spotlight.title')}
        description={t('page.home.priority_spotlight.description')}
      />
      <PriorityProposalsBox priorityProposals={priorityProposals} isLoading={isLoading} />
    </div>
  )
}

export default UpcomingOpportunities
