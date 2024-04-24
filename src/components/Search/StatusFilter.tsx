import isEqual from 'lodash/isEqual'
import toSnakeCase from 'lodash/snakeCase'

import { getUrlFilters } from '../../helpers'
import useFormatMessage from '../../hooks/useFormatMessage'
import useURLSearchParams from '../../hooks/useURLSearchParams'
import { ProjectStatus } from '../../types/grants'
import { ProposalStatus } from '../../types/proposals'
import locations from '../../utils/locations'

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
  const newParams = getUrlFilters(FILTER_KEY, params)

  return (
    <FilterContainer title={t('navigation.search.status_filter_title')}>
      <FilterLabel
        label={t(`status.all`)}
        href={isGrantFilter ? `?${newParams.toString()}` : locations.proposals(newParams)}
        active={!status}
      />
      {Object.values(statusType).map((value, index) => {
        const label = toSnakeCase(value)
        if (ProposalStatus.Deleted !== value) {
          const newParams = getUrlFilters(FILTER_KEY, params, label)

          return (
            <FilterLabel
              key={'status_filter' + index}
              label={t(`${isGrantFilter ? 'grant_' : ''}status.${label}`)}
              href={isGrantFilter ? `?${newParams.toString()}` : locations.proposals(newParams)}
              active={status === label}
            />
          )
        }
      })}
    </FilterContainer>
  )
}
