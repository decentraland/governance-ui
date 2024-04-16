import isEqual from 'lodash/isEqual'
import toSnakeCase from 'lodash/snakeCase'

import { getUrlFilters } from '../../helpers'
import useFormatMessage from '../../hooks/useFormatMessage'
import useURLSearchParams from '../../hooks/useURLSearchParams'
import { ProjectStatus } from '../../types/grants'
import { ProposalStatus } from '../../types/proposals'

import { FilterProps } from './CategoryFilter'
import FilterContainer from './FilterContainer'
import FilterLabel from './FilterLabel'

type StatusType = typeof ProposalStatus | typeof ProjectStatus

const FILTER_KEY = 'status'

export default function StatusFilter({ statusType }: FilterProps & { statusType: StatusType }) {
  const t = useFormatMessage()
  const params = useURLSearchParams()
  const status = params.get(FILTER_KEY)
  const isGrantFilter = isEqual(statusType, ProjectStatus)

  return (
    <FilterContainer title={t('navigation.search.status_filter_title')}>
      <FilterLabel label={t(`status.all`)} href={getUrlFilters(FILTER_KEY, params)} active={!status} />
      {Object.values(statusType).map((value, index) => {
        const label = toSnakeCase(value)
        if (ProposalStatus.Deleted !== value) {
          return (
            <FilterLabel
              key={'status_filter' + index}
              label={t(`${isGrantFilter ? 'grant_' : ''}status.${label}`)}
              href={getUrlFilters(FILTER_KEY, params, label)}
              active={status === label}
            />
          )
        }
      })}
    </FilterContainer>
  )
}
