import { TransparencyVesting } from '../clients/Transparency'
import { getQuarterDates } from '../helpers'
import { ProjectStatus, TransparencyProjectStatus } from '../types/grants'
import { ProjectVestingData, ProposalAttributes, ProposalProject, ProposalWithProject } from '../types/proposals'

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

export function isCurrentQuarterProject(year: number, quarter: number, startAt?: number) {
  if (!startAt) {
    return false
  }

  const { startDate, endDate } = getQuarterDates(quarter, year)

  if (!startDate || !endDate) {
    return false
  }

  return Time.unix(startAt || 0).isAfter(startDate) && Time.unix(startAt || 0).isBefore(endDate)
}

function toGovernanceProjectStatus(status: TransparencyProjectStatus) {
  switch (status) {
    case TransparencyProjectStatus.Pending:
      return ProjectStatus.Pending
    case TransparencyProjectStatus.InProgress:
      return ProjectStatus.InProgress
    case TransparencyProjectStatus.Finished:
      return ProjectStatus.Finished
    case TransparencyProjectStatus.Paused:
      return ProjectStatus.Paused
    case TransparencyProjectStatus.Revoked:
      return ProjectStatus.Revoked
  }
}

function getProjectVestingData(proposal: ProposalAttributes, vesting?: TransparencyVesting): ProjectVestingData {
  if (proposal.enacting_tx) {
    return {
      enacting_tx: proposal.enacting_tx,
      enacted_at: Time(proposal.updated_at).unix(),
    }
  }

  if (!vesting) {
    return {}
  }

  const { token, vesting_start_at, vesting_finish_at, vesting_total_amount, vesting_released, vesting_releasable } =
    vesting

  return {
    token,
    enacted_at: Time(vesting_start_at).unix(),
    contract: {
      vesting_total_amount: Math.round(vesting_total_amount),
      vested_amount: Math.round(vesting_released + vesting_releasable),
      releasable: Math.round(vesting_releasable),
      released: Math.round(vesting_released),
      start_at: Time(vesting_start_at).unix(),
      finish_at: Time(vesting_finish_at).unix(),
    },
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
  const vestingData = getProjectVestingData(proposal, vesting)
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
    ...vestingData,
  }
}
