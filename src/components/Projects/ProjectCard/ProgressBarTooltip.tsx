import { useIntl } from 'react-intl'

import { Popup } from 'decentraland-ui/dist/components/Popup/Popup'

import useFormatMessage from '../../../hooks/useFormatMessage'
import { ProposalProject } from '../../../types/proposals'
import Time, { formatDate } from '../../../utils/date/Time'
import { CLIFF_PERIOD_IN_DAYS } from '../../../utils/proposal'

interface Props {
  grant: ProposalProject
  isInCliff: boolean
  children: React.ReactNode
}

function ProgressBarTooltip({ grant, isInCliff, children }: Props) {
  const t = useFormatMessage()
  const intl = useIntl()

  const { contract, tx_amount, token, enacted_at, enacting_tx } = grant
  const isOneTimePayment = !contract && enacting_tx
  const vestedAmount = (contract ? contract.vested_amount : tx_amount) || 0
  const releasedAmount = !isOneTimePayment && contract ? contract.released : 0

  let textToShow = ''

  if (isInCliff && enacted_at) {
    const now = Time.utc()
    const vestingStartDate = Time.unix(enacted_at)
    const elapsedSinceVestingStarted = now.diff(vestingStartDate, 'day')
    const daysToGo = CLIFF_PERIOD_IN_DAYS - elapsedSinceVestingStarted

    textToShow = t('page.profile.grants.cliff_period', { count: daysToGo })
  } else if (isOneTimePayment && enacted_at) {
    textToShow = t('page.profile.grants.one_time_tx', { time: formatDate(new Date(enacted_at * 1000)) })
  } else if (releasedAmount > 0) {
    textToShow = t('page.profile.grants.released', { amount: intl.formatNumber(releasedAmount), token: token })
  } else {
    textToShow = t('page.profile.grants.vested', { amount: intl.formatNumber(vestedAmount), token: token })
  }

  return <Popup content={textToShow} position="top center" trigger={children} on="hover" />
}

export default ProgressBarTooltip
