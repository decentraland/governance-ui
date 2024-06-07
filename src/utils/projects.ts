import { TransparencyVesting } from '../clients/Transparency'
import { Vesting, VestingStatus } from '../clients/VestingData.ts'
import { getQuarterDates } from '../helpers'
import { ProjectStatus } from '../types/grants'
import { ProjectFunding, ProposalAttributes, ProposalProject, ProposalWithProject } from '../types/proposals'

import Time from './date/Time'

export function getHighBudgetVpThreshold(budget: number) {
  return 1200000 + budget * 40
}

export function getGoogleCalendarUrl({
  title,
  details,
  startAt,
}: {
  title: string
  details: string
  startAt: string | Date
}) {
  const params = new URLSearchParams()
  params.set('text', title)
  params.set('details', details)
  const startAtDate = Time.from(startAt, { utc: true })
  const dates = [
    startAtDate.format(Time.Formats.GoogleCalendar),
    Time.from(startAt, { utc: true }).add(15, 'minutes').format(Time.Formats.GoogleCalendar),
  ]
  params.set('dates', dates.join('/'))

  return `https://calendar.google.com/calendar/r/eventedit?${params.toString()}`
}

export function isCurrentProject(status?: ProjectStatus) {
  return status === ProjectStatus.InProgress || status === ProjectStatus.Paused || status === ProjectStatus.Pending
}

export function isCurrentQuarterProject(year: number, quarter: number, startAt?: string) {
  if (!startAt) {
    return false
  }
  const { startDate, endDate } = getQuarterDates(quarter, year)

  if (!startDate || !endDate) {
    return false
  }
  return Time(startAt || 0).isAfter(startDate) && Time(startAt || 0).isBefore(endDate)
}

function toGovernanceProjectStatus(status: VestingStatus) {
  switch (status) {
    case VestingStatus.Pending:
      return ProjectStatus.Pending
    case VestingStatus.InProgress:
      return ProjectStatus.InProgress
    case VestingStatus.Finished:
      return ProjectStatus.Finished
    case VestingStatus.Paused:
      return ProjectStatus.Paused
    case VestingStatus.Revoked:
      return ProjectStatus.Revoked
  }
}

function getFunding(proposal: ProposalAttributes, transparencyVesting?: TransparencyVesting): ProjectFunding {
  if (proposal.enacting_tx) {
    // one time payment
    return {
      enacted_at: proposal.updated_at.toISOString(),
      one_time_payment: {
        enacting_tx: proposal.enacting_tx,
      },
    }
  }

  if (!transparencyVesting) {
    return {}
  }

  return {
    enacted_at: transparencyVesting.vesting_start_at,
    vesting: toVesting(transparencyVesting),
  }
}

function getProjectStatus(proposal: ProposalAttributes, vesting?: TransparencyVesting) {
  if (proposal.enacting_tx) {
    return ProjectStatus.Finished
  }

  if (!vesting) {
    return ProjectStatus.Pending
  }

  const { vesting_status } = vesting

  return toGovernanceProjectStatus(vesting_status)
}

export function createProposalProject(proposal: ProposalWithProject, vesting?: TransparencyVesting): ProposalProject {
  const funding = getFunding(proposal, vesting)
  const status = getProjectStatus(proposal, vesting)

  return {
    id: proposal.id,
    project_id: proposal.project_id,
    status,
    title: proposal.title,
    user: proposal.user,
    about: proposal.configuration.abstract,
    type: proposal.type,
    size: proposal.configuration.size || proposal.configuration.funding,
    created_at: proposal.created_at.getTime(),
    configuration: {
      category: proposal.configuration.category || proposal.type,
      tier: proposal.configuration.tier,
    },
    funding,
  }
}

export function toVesting(transparencyVesting: TransparencyVesting): Vesting {
  const {
    token,
    vesting_start_at,
    vesting_finish_at,
    vesting_total_amount,
    vesting_released,
    vesting_releasable,
    vesting_status,
    vesting_address,
  } = transparencyVesting

  return {
    token,
    address: vesting_address,
    start_at: vesting_start_at,
    finish_at: vesting_finish_at,
    releasable: Math.round(vesting_releasable),
    released: Math.round(vesting_released),
    total: Math.round(vesting_total_amount),
    vested: Math.round(vesting_released + vesting_releasable),
    status: vesting_status,
  }
}
