import { useIntl } from 'react-intl'

import isNumber from 'lodash/isNumber'

import { CURRENCY_FORMAT_OPTIONS, getVestingContractUrl } from '../../helpers'
import useFormatMessage from '../../hooks/useFormatMessage'
import useManaPrice from '../../hooks/useManaPrice'
import useVestingContractData from '../../hooks/useVestingContractData'
import FinancialCard from '../Updates/FinancialCard'

import DaoFinancial from './DaoFinancial'

const DAO_VESTING_CONTRACT_ADDRESS = '0x7a3abf8897f31b56f09c6f69d074a393a905c1ac'

function DaoVestingCard() {
  const t = useFormatMessage()
  const { vestingData } = useVestingContractData([DAO_VESTING_CONTRACT_ADDRESS])
  const { releasable, released, total } = vestingData?.[0] || {}
  const vested = releasable && released ? releasable + released : undefined
  const { formatNumber } = useIntl()
  const manaPrice = useManaPrice()

  return (
    <DaoFinancial>
      <FinancialCard
        title={t('page.transparency.mission.vesting_title')}
        value={t('page.transparency.mission.releasable_value', {
          value:
            isNumber(releasable) && isNumber(manaPrice)
              ? formatNumber(releasable * manaPrice, CURRENCY_FORMAT_OPTIONS)
              : '$--',
        })}
        subtitle={t('page.transparency.mission.vesting_subtitle', {
          value:
            isNumber(total) && isNumber(vested) && isNumber(manaPrice)
              ? formatNumber((total - vested) * manaPrice, CURRENCY_FORMAT_OPTIONS)
              : '$--',
        })}
        href={getVestingContractUrl(DAO_VESTING_CONTRACT_ADDRESS)}
        helper={t('page.transparency.mission.vesting_helper')}
      />
    </DaoFinancial>
  )
}

export default DaoVestingCard
