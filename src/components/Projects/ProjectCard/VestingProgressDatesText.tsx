import useFormatMessage, { FormatMessageFunction } from '../../../hooks/useFormatMessage.ts'
import { ProjectFunding } from '../../../types/proposals.ts'
import Time from '../../../utils/date/Time.ts'
import Text from '../../Common/Typography/Text.tsx'

interface Props {
  funding: ProjectFunding
}

function getText(funding: ProjectFunding, t: FormatMessageFunction) {
  const { vesting, one_time_payment, enacted_at } = funding || {}
  const enactedDate = Time(enacted_at).fromNow()

  const firstPart =
    (one_time_payment ? t('page.grants.transaction_date') : t('page.grants.started_date')) + ' ' + enactedDate || ''
  const secondPart = vesting?.finish_at
    ? Time(vesting.finish_at).isBefore(Time())
      ? t('page.grants.ended_date')
      : t('page.grants.end_date') + ' ' + Time(vesting.finish_at).fromNow()
    : ''

  return firstPart + ', ' + secondPart.toLowerCase()
}

function VestingProgressDatesText({ funding }: Props) {
  const t = useFormatMessage()

  return (
    <Text size="sm" color="secondary" weight="normal">
      {getText(funding, t) + '.'}
    </Text>
  )
}

export default VestingProgressDatesText
