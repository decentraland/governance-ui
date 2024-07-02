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

  if (tickerFilter.comments) {
    eventTypes.push(EventType.ProposalCommented, EventType.ProjectUpdateCommented)
  }
  if (tickerFilter.delegation) {
    eventTypes.push(EventType.DelegationSet, EventType.DelegationClear)
  }
  if (tickerFilter.project_updates) {
    eventTypes.push(EventType.UpdateCreated)
  }
  if (tickerFilter.votes) {
    eventTypes.push(EventType.Voted)
  }
  if (tickerFilter.proposals_created) {
    eventTypes.push(EventType.ProposalCreated)
  }
  if (tickerFilter.proposals_finished) {
    eventTypes.push(EventType.ProposalFinished)
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
