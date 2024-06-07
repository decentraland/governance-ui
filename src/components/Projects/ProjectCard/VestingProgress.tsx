import classNames from 'classnames'

import useFormatMessage from '../../../hooks/useFormatMessage'
import { ProjectFunding } from '../../../types/proposals'
import Time from '../../../utils/date/Time'
import '../../Modal/VotingPowerDelegationDetail/VotingPowerDistribution.css'

import PercentageLabel from './PercentageLabel'
import './VestingProgress.css'

type Props = {
  projectFunding: ProjectFunding | undefined
  basic?: boolean
}

const getRoundedPercentage = (value: number, total: number) => Math.min(Math.round((value * 100) / total), 100)

const VestingProgress = ({ projectFunding, basic }: Props) => {
  const t = useFormatMessage()
  if (!projectFunding || !projectFunding.enacted_at) return null

  const { vesting, one_time_payment, enacted_at } = projectFunding
  const token = vesting ? vesting.token : one_time_payment?.token
  const total = vesting?.total || 100
  const vestedPercentage = vesting ? getRoundedPercentage(vesting.vested, total) : 100
  const releasedPercentage = vesting ? getRoundedPercentage(vesting.released, total) : null
  const vestedAmountText = vesting ? `${t(`general.number`, { value: vesting.vested || 0 })} ${token}` : null
  const releasedText = vesting
    ? `${t(`general.number`, { value: vesting.released })} ${token} ${t('page.grants.released')}`
    : t('page.grants.one_time_payment')
  const enactedDate = Time(enacted_at).fromNow()

  return (
    <div className="VestingProgress">
      {!basic && (
        <div className="VestingProgress__Labels">
          <div className="VestingProgress__VestedInfo">
            {vestedAmountText && (
              <span className="VestingProgress__Bold VestingProgress__Ellipsis">{vestedAmountText}</span>
            )}
            <span className="VestingProgress__Ellipsis">
              {one_time_payment ? t('page.grants.transferred') : t('page.grants.vested')}
            </span>
            <PercentageLabel percentage={vestedPercentage} color={one_time_payment ? 'Fuchsia' : 'Yellow'} />
          </div>
          <div className="VestingProgress__ReleasedInfo VestingProgress__Ellipsis">
            {vesting && <div className="VestingProgress__ReleasedInfoLabel" />}
            <span className={classNames('VestingProgress__Ellipsis', !vesting && 'VestingProgressBar__LightText')}>
              {releasedText}
            </span>
          </div>
        </div>
      )}

      <div className="VestingProgressBar">
        {!!(releasedPercentage && releasedPercentage > 0) && (
          <div
            className="VestingProgressBar__Item VestingProgressBar__Released"
            style={{ width: releasedPercentage + '%' }}
          />
        )}
        {vestedPercentage > 0 && (
          <div
            className="VestingProgressBar__Item VestingProgressBar__Vested"
            style={{ width: vestedPercentage + '%' }}
          />
        )}
        {one_time_payment && <div className="VestingProgressBar__Item VestingProgressBar__Transferred" />}
      </div>

      {!basic && (
        <div className="VestingProgress__Dates">
          <div className="VestingProgress__VestedAt">
            <span>{one_time_payment ? t('page.grants.transaction_date') : t('page.grants.started_date')}</span>
            <span className="VestingProgress__VestedDate">{enactedDate}</span>
          </div>
          {vesting?.finish_at && (
            <div className="VestingProgress__VestedAt">
              <span>
                {Time(vesting.finish_at).isBefore(Time()) ? t('page.grants.ended_date') : t('page.grants.end_date')}
              </span>
              <span className="VestingProgress__VestedDate">{Time(vesting.finish_at).fromNow()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default VestingProgress
