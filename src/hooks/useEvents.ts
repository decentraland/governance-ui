import { useQuery } from '@tanstack/react-query'

import { Governance } from '../clients/Governance'
import { EventFilter } from '../types/events'

import { ONE_MINUTE_MS } from './constants'

function useEvents(filters: Partial<EventFilter>) {
  const {
    data: events,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['events', JSON.stringify(filters)],
    queryFn: () => Governance.get().getLatestEvents(filters),
    refetchInterval: ONE_MINUTE_MS,
    refetchIntervalInBackground: true,
  })
  return {
    events,
    refetch,
    isLoading,
  }
}

export default useEvents
