import { useEffect, useState } from 'react'

import useEvents from '../../hooks/useEvents'
import useFormatMessage from '../../hooks/useFormatMessage'
import { EventType } from '../../types/events'
import Heading from '../Common/Typography/Heading'

import './ActivityTicker.css'
import ActivityTickerFilter, { INITIAL_TICKER_FILTER_STATE, TickerFilter } from './ActivityTickerFilter'
import ActivityTickerList from './ActivityTickerList'

function parseTickerFilter(tickerFilter: TickerFilter) {
  const eventTypes: EventType[] = []

  const filterMap: Record<keyof TickerFilter, EventType[]> = {
    comments: [EventType.ProposalCommented, EventType.ProjectUpdateCommented],
    delegation: [EventType.DelegationSet, EventType.DelegationClear],
    project_updates: [EventType.UpdateCreated],
    votes: [EventType.Voted],
    proposals_created: [EventType.ProposalCreated],
    proposals_finished: [EventType.ProposalFinished],
    vestings_created: [EventType.VestingCreated],
  }

  for (const [key, isSelected] of Object.entries(tickerFilter)) {
    if (isSelected) {
      eventTypes.push(...filterMap[key as keyof TickerFilter])
    }
  }

  return eventTypes
}

export default function ActivityTicker() {
  const t = useFormatMessage()
  const [filterState, setFilterState] = useState<TickerFilter>(INITIAL_TICKER_FILTER_STATE)

  const { events, refetch, isLoading } = useEvents({ event_type: parseTickerFilter(filterState) })

  const handleApply = (filters: TickerFilter) => {
    setFilterState(filters)
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState])

  return (
    <div className="ActivityTicker">
      <div className="ActivityTicker__TitleContainer">
        <div className="ActivityTicker__Gradient" />
        <Heading className="ActivityTicker__Title" size="3xs" weight="normal">
          {t('page.home.activity_ticker.title')}
        </Heading>
        <ActivityTickerFilter onApply={handleApply} filterState={filterState} />
      </div>
      <ActivityTickerList isLoading={isLoading} events={events} />
    </div>
  )
}
