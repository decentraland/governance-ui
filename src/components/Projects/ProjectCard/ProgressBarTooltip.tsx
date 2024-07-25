import { useIntl } from 'react-intl'

import { Popup } from 'decentraland-ui/dist/components/Popup/Popup'

import useFormatMessage from '../../../hooks/useFormatMessage'
import { ProjectFunding } from '../../../types/proposals'
import Time, { formatDate } from '../../../utils/date/Time'
import { CLIFF_PERIOD_IN_DAYS } from '../../../utils/proposal'
import Text from '../../Common/Typography/Text'
import Dot from '../../Icon/Dot.tsx'

import './ProgressBarTooltip.css'

interface Props {
  funding: ProjectFunding
  isInCliff: boolean
  children: React.ReactNode
}

function ProjectFundingProgressBarTooltip({ funding, isInCliff, children }: Props) {
  const t = useFormatMessage()
  const intl = useIntl()

  const { vesting, one_time_payment, enacted_at } = funding || {}
  const token = vesting ? vesting.token : one_time_payment?.token
  const isOneTimePayment = !!one_time_payment
  const vestedAmount = (vesting ? vesting.vested : one_time_payment?.tx_amount) || 0
  const releasedAmount = !isOneTimePayment && vesting ? vesting.released : 0

  let content: React.ReactNode = ''

  if (isInCliff && enacted_at) {
    const now = Time.utc()
    const vestingStartDate = Time(enacted_at)
    const elapsedSinceVestingStarted = now.diff(vestingStartDate, 'day')
    const daysToGo = CLIFF_PERIOD_IN_DAYS - elapsedSinceVestingStarted

    content = t('page.profile.projects.cliff_period', { count: daysToGo })
  } else if (isOneTimePayment && enacted_at) {
    content = t('page.profile.projects.one_time_tx', { time: formatDate(new Date(enacted_at)) })
  } else {
    content = (
      <div className="ProjectFundingProgressBarTooltip">
        <Text
          size="xs"
          weight="medium"
          color="white-900"
          transform="uppercase"
          className="ProjectFundingProgressBarTooltip__Title"
        >
          {t('page.profile.projects.funding_tooltip_title')}
        </Text>
        <div className="ProjectFundingProgressBarTooltip__Label">
          <Dot hexColor="#44B600" />
          {t('page.profile.projects.released', { amount: intl.formatNumber(releasedAmount), token: token })}
        </div>
        <div className="ProjectFundingProgressBarTooltip__Label">
          <Dot hexColor="#FFB03FFF" />
          {t('page.profile.projects.vested', { amount: intl.formatNumber(vestedAmount), token: token })}
        </div>
      </div>
    )
  }

  return <Popup content={content} position="top center" trigger={children} on="hover" />
}

export default ProjectFundingProgressBarTooltip
