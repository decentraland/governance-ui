import { ProjectTypeFilter } from '../components/Search/CategoryFilter'
import { NewGrantCategory } from '../types/grants'
import { CatalystType, HiringType, PoiType, ProposalStatus, ProposalType } from '../types/proposals'

export function toProposalListPage(value: string | number | null | undefined): number {
  if (typeof value === 'number') {
    return Math.max(1, value)
  } else if (typeof value === 'string') {
    const page = Number(value)
    return Number.isFinite(page) ? Math.max(1, page) : 1
  } else {
    return 1
  }
}

export type ProposalListPage = {
  page: string
}

export type ProposalsStatusFilter = {
  status: ProposalStatus
}

export type ProposalsTypeFilter = {
  type: ProposalType
}

export type GrantCategoryTypeFilter = {
  subtype: NewGrantCategory
}

export type ProposalsModal = {
  modal: 'new'
}

function url(path = '', query: Record<string, string> | URLSearchParams = {}) {
  const params = new URLSearchParams(query).toString()
  const formattedPath = path !== '' && !path.startsWith('/') ? '/' + path : path
  const formattedParams = path.includes('?') ? '&' + params : '?' + params

  return formattedPath + (params ? formattedParams : '')
}

export default {
  home: () => url('/'),
  proposals: (
    options:
      | Partial<
          ProposalListPage & ProposalsStatusFilter & ProposalsTypeFilter & GrantCategoryTypeFilter & ProposalsModal
        >
      | URLSearchParams = {}
  ) => url('/proposals/', options),
  proposal: (
    proposalId: string,
    options: {
      new?: 'true'
      newUpdate?: 'true'
      pending?: 'true'
      bid?: 'true'
      anchor?: string
    } = {}
  ) => {
    const { anchor, ...otherOptions } = options
    const anchorFragment = anchor ? `#${anchor}` : ''
    return url(`/proposal/`, { id: proposalId, ...otherOptions }) + anchorFragment
  },
  project: (options: Partial<{ id: string }> = {}) => url('/project/', options),
  submit: (
    type?: ProposalType,
    options: {
      linked_proposal_id?: string
      request?: PoiType | HiringType | CatalystType
      category?: NewGrantCategory
    } = {}
  ) => url(type ? `/submit/${String(type).replaceAll('_', '-')}/` : '/submit/', options),
  submitUpdate: (options: { id?: string; projectId: string }) => url('/submit/update/', options),
  profile: (options: Partial<{ address: string }> = {}) => url('/profile/', options),
  transparency: () => url('/transparency/'),
  debug: () => url('/debug/'),
  welcome: () => url('/welcome/', {}),
  update: (id: string) => url('/update/', { id }),
  projects: (type?: ProjectTypeFilter) => url(`/projects/${type ? `?type=${type}` : ''}`, {}),
  edit: {
    update: (id: string) => url('edit/update/', { id }),
  },
}
