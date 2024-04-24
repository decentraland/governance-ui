import { useCallback, useMemo } from 'react'

import isEqual from 'lodash/isEqual'
import toSnakeCase from 'lodash/snakeCase'

import { getUrlFilters } from '../../helpers'
import useFormatMessage from '../../hooks/useFormatMessage'
import useURLSearchParams from '../../hooks/useURLSearchParams'
import { NewGrantCategory, SubtypeAlternativeOptions, toGrantSubtype } from '../../types/grants'
import { BiddingProcessType, GovernanceProcessType, ProposalType } from '../../types/proposals'
import locations from '../../utils/locations'
import { categoryIcons } from '../Category/CategoryBanner'
import CategoryOption from '../Category/CategoryOption'
import All from '../Icon/ProposalCategories/All'
import Grant from '../Icon/ProposalCategories/Grant'
import Tender from '../Icon/ProposalCategories/Tender'

import './CategoryFilter.css'
import FilterContainer from './FilterContainer'

export enum ProjectTypeFilter {
  All = 'all_projects',
  Grants = 'grants',
  BiddingAndTendering = 'bidding_and_tendering',
}

export type FilterType = typeof ProposalType | typeof ProjectTypeFilter
export type Counter = Record<string, number | undefined>
export type FilterProps = {
  startOpen?: boolean
  categoryCount?: Counter
}

const FILTER_KEY = 'type'
const GOVERNANCE_GROUP: GovernanceProcessType[] = [ProposalType.Poll, ProposalType.Draft, ProposalType.Governance]
const BIDDING_GROUP: BiddingProcessType[] = [ProposalType.Pitch, ProposalType.Tender, ProposalType.Bid]

function getUncategorizedProposalTypes(types: typeof ProposalType) {
  return Object.values(types).filter((type) => {
    return ![ProposalType.Grant, ...BIDDING_GROUP, ...GOVERNANCE_GROUP].includes(type)
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const icons: Record<string, any> = {
  all_projects: All,
  grants: Grant,
  bidding_and_tendering: Tender,
  ...categoryIcons,
}

const getCategoryIcon = (type: string, size?: number) => {
  const Icon = icons[type]

  return <Icon size={size} />
}

function getGrantSubtypeHref(href: string | undefined, subtype: string) {
  const url = new URL(href || '/', 'http://localhost') // Create a URL object using a dummy URL
  if (subtype === SubtypeAlternativeOptions.All) {
    url.searchParams.delete('subtype')
  } else {
    url.searchParams.set('subtype', subtype)
  }
  const newHref = '?' + url.searchParams.toString()
  return newHref
}

export default function CategoryFilter({
  filterType,
  categoryCount,
  showAllFilter = true,
}: FilterProps & { filterType: FilterType; showAllFilter?: boolean }) {
  const t = useFormatMessage()
  const params = useURLSearchParams()
  const type = params.get(FILTER_KEY)
  const currentSubtype = useMemo(() => toGrantSubtype(params.get('subtype'), () => null), [params])

  const areProposals = isEqual(filterType, ProposalType)
  const filters = areProposals
    ? getUncategorizedProposalTypes(filterType as never)
    : (Object.values(filterType) as ProjectTypeFilter[])

  const isGrantSubtypeActive = useCallback(
    (subtype: string) => {
      if (subtype === SubtypeAlternativeOptions.All && !currentSubtype) {
        return true
      }

      return subtype === currentSubtype
    },
    [currentSubtype]
  )

  const isGroupActive = useCallback(
    (item: string) => {
      return toSnakeCase(item) === toSnakeCase(type ?? '')
    },
    [type]
  )

  return (
    <FilterContainer title={t('navigation.search.category_filter_title')}>
      {showAllFilter && (
        <CategoryOption
          type="all_proposals"
          href={locations.proposals(getUrlFilters(FILTER_KEY, params))}
          active={!type}
          className="CategoryFilter__CategoryOption"
          icon={<All />}
          title={t(`category.all_proposals_title`)}
        />
      )}
      {filters.map((filter, index) => {
        const isAllProjectsSelected = filter === 'all_projects' && !params.toString().includes('type')
        const newParams = getUrlFilters(FILTER_KEY, params, filter === 'all_projects' ? undefined : filter)
        const projectParams = newParams ? `?${newParams.toString()}` : ''

        return (
          <CategoryOption
            key={'category_filter' + index}
            className="CategoryFilter__CategoryOption"
            type={filter}
            href={areProposals ? locations.proposals(newParams) : projectParams}
            active={type === filter || isAllProjectsSelected}
            count={categoryCount?.[filter]}
            icon={getCategoryIcon(filter, 24)}
            title={t(`category.${filter}_title`)}
            subcategories={
              filter === ProjectTypeFilter.Grants
                ? [`${SubtypeAlternativeOptions.All}`, ...Object.values(NewGrantCategory)]
                : undefined
            }
            isSubcategoryActive={isGrantSubtypeActive}
            subcategoryHref={(href, subcategory) => getGrantSubtypeHref(href, subcategory)}
          />
        )
      })}
      {areProposals && (
        <>
          <CategoryOption
            className="CategoryFilter__CategoryOption"
            type="governance_process"
            active={GOVERNANCE_GROUP.includes(type as never)}
            icon={getCategoryIcon(ProposalType.Governance, 24)}
            title={t(`category.governance_process_title`)}
            subcategories={GOVERNANCE_GROUP}
            isSubcategoryActive={isGroupActive}
            subcategoryHref={(_, subcategory) => locations.proposals(getUrlFilters(FILTER_KEY, params, subcategory))}
          />
          <CategoryOption
            className="CategoryFilter__CategoryOption"
            type={ProposalType.Grant}
            href={locations.proposals(getUrlFilters(FILTER_KEY, params, ProposalType.Grant))}
            active={type === ProposalType.Grant}
            count={categoryCount?.[ProposalType.Grant]}
            icon={getCategoryIcon(ProposalType.Grant, 24)}
            title={t(`category.${ProposalType.Grant}_title`)}
            subcategories={[
              `${SubtypeAlternativeOptions.All}`,
              ...Object.values(NewGrantCategory),
              `${SubtypeAlternativeOptions.Legacy}`,
            ]}
            isSubcategoryActive={isGrantSubtypeActive}
            subcategoryHref={(href, subcategory) => getGrantSubtypeHref(href, subcategory)}
          />
          <CategoryOption
            className="CategoryFilter__CategoryOption"
            type={ProjectTypeFilter.BiddingAndTendering}
            active={BIDDING_GROUP.includes(type as never)}
            icon={getCategoryIcon(ProposalType.Tender, 24)}
            title={t(`category.${ProjectTypeFilter.BiddingAndTendering}_title`)}
            subcategories={BIDDING_GROUP}
            isSubcategoryActive={isGroupActive}
            subcategoryHref={(_, subcategory) => locations.proposals(getUrlFilters(FILTER_KEY, params, subcategory))}
          />
        </>
      )}
    </FilterContainer>
  )
}
