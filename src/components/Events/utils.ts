import { getVestingContractUrl } from '../../helpers'
import { ActivityTickerEvent, EventType, ProposalEventData } from '../../types/events'
import locations from '../../utils/locations'

const PROPOSAL_RELATED_EVENTS = new Set([
  EventType.ProposalCreated,
  EventType.ProposalFinished,
  EventType.Voted,
  EventType.ProposalCommented,
])

export const getLink = (event: ActivityTickerEvent) => {
  if (PROPOSAL_RELATED_EVENTS.has(event.event_type)) {
    const eventData = event.event_data as ProposalEventData
    return locations.proposal(eventData.proposal_id)
  }

  if (event.event_type === EventType.VestingCreated) {
    return getVestingContractUrl(event.event_data.vesting_address)
  }

  if (event.event_type === EventType.UpdateCreated || event.event_type === EventType.ProjectUpdateCommented) {
    return locations.update(event.event_data.update_id)
  }
}

export function extractUpdateNumber(title: string) {
  const match = title.match(/Update #\d+/)
  return match ? match[0] : null
}
