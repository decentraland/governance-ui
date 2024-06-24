import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Governance } from '../clients/Governance'
import { UpdateResponse } from '../types/updates'
import Time from '../utils/date/Time.ts'
import { isBetweenLateThresholdDate } from '../utils/updates.ts'

import { DEFAULT_QUERY_STALE_TIME } from './constants'

export default function useProjectUpdates(projectId?: string | null) {
  const {
    data: updates,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['projectUpdates', projectId],
    queryFn: async () => {
      if (!projectId) {
        return {} as UpdateResponse
      }
      return Governance.get().getProjectUpdates(projectId)
    },
    staleTime: DEFAULT_QUERY_STALE_TIME,
  })

  const publicUpdates = updates?.publicUpdates || []
  const pendingUpdates = updates?.pendingUpdates
  const nextUpdate = updates?.nextUpdate
  const hasUpdates = publicUpdates.length > 0
  const currentUpdate = updates?.currentUpdate
  const hasSubmittedUpdate = !!currentUpdate?.completion_date
  const hasPendingMandatoryUpdate = !!currentUpdate && !currentUpdate.completion_date
  const nextDueDateRemainingDays = Time(nextUpdate?.due_date).diff(new Date(), 'days')

  const latePendingUpdate = useMemo(
    () =>
      pendingUpdates?.find(
        (update) =>
          update.id !== nextUpdate?.id && Time().isAfter(update.due_date) && isBetweenLateThresholdDate(update.due_date)
      ),
    [nextUpdate?.id, pendingUpdates]
  )

  return {
    publicUpdates,
    pendingUpdates: pendingUpdates || [],
    nextUpdate,
    currentUpdate,
    isLoading,
    isError,
    refetchUpdates: refetch,
    latestPublishedUpdate: updates?.publicUpdates?.find((item) => !!item.completion_date),
    latePendingUpdate,
    hasUpdates,
    hasSubmittedUpdate,
    nextDueDateRemainingDays,
    hasPendingMandatoryUpdate,
  }
}
