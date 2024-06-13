import { useIntl } from 'react-intl'

import { Popup } from 'decentraland-ui/dist/components/Popup/Popup'

import useFormatMessage from '../../../hooks/useFormatMessage'
import { ProposalProject } from '../../../types/proposals'
import Time, { formatDate } from '../../../utils/date/Time'
import { CLIFF_PERIOD_IN_DAYS } from '../../../utils/proposal'

interface Props {
  proposalProject: ProposalProject
  isInCliff: boolean
  children: React.ReactNode
}

function ProgressBarTooltip({ proposalProject, isInCliff, children }: Props) {
  const t = useFormatMessage()
  const intl = useIntl()

  const { funding } = proposalProject
  const { vesting, one_time_payment, enacted_at } = funding || {}
  const token = vesting ? vesting.token : one_time_payment?.token
  const isOneTimePayment = !!one_time_payment
  const vestedAmount = (vesting ? vesting.vested : one_time_payment?.tx_amount) || 0
  const releasedAmount = !isOneTimePayment && vesting ? vesting.released : 0

  let textToShow = ''

  if (isInCliff && enacted_at) {
    const now = Time.utc()
    const vestingStartDate = Time(enacted_at)
    const elapsedSinceVestingStarted = now.diff(vestingStartDate, 'day')
    const daysToGo = CLIFF_PERIOD_IN_DAYS - elapsedSinceVestingStarted

    textToShow = t('page.profile.grants.cliff_period', { count: daysToGo })
  } else if (isOneTimePayment && enacted_at) {
    textToShow = t('page.profile.grants.one_time_tx', { time: formatDate(new Date(enacted_at)) })
  } else if (releasedAmount > 0) {
    textToShow = t('page.profile.grants.released', { amount: intl.formatNumber(releasedAmount), token: token })
  } else {
    textToShow = t('page.profile.grants.vested', { amount: intl.formatNumber(vestedAmount), token: token })
  }

  return <Popup content={textToShow} position="top center" trigger={children} on="hover" />
}

export default ProgressBarTooltip
