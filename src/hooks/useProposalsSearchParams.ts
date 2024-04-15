import { useMemo } from 'react'

import { SubtypeOptions, toGrantSubtype } from '../types/grants'
import { ProposalStatus, ProposalType, SortingOrder } from '../types/proposals'
import { toProposalListPage } from '../utils/locations'
import { toProposalStatus, toProposalType, toSortingOrder } from '../utils/proposal'

import useURLSearchParams from './useURLSearchParams'

export type SearchParams = {
  type: ProposalType | undefined
  subtype: SubtypeOptions | undefined
  status: ProposalStatus | undefined
  search: string
  searching: boolean
  filtering: boolean
  timeFrame: string
  order?: SortingOrder
  page: number
}

export function useProposalsSearchParams(): SearchParams {
  const params = useURLSearchParams()

  return useMemo(() => {
    const type = toProposalType(params.type, () => undefined)
    const subtype = toGrantSubtype(params.subtype, () => undefined)
    const status = toProposalStatus(params.status, () => undefined)
    const search = params.search || ''
    const timeFrame = params.timeFrame || ''
    const order = toSortingOrder(params.order, () => undefined)
    const searching = !!search && search.length > 0
    const page = toProposalListPage(params.page) ?? undefined
    const filtering = !!type || !!subtype || !!status || searching || !!(timeFrame && timeFrame.length > 0)

    return { type, subtype, status, search, searching, timeFrame, order, page, filtering }
  }, [params])
}
