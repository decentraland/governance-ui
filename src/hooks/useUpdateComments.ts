import { useQuery } from '@tanstack/react-query'

import { Governance } from '../clients/Governance'
import { UpdateAttributes } from '../types/updates'

import { COMMENTS_QUERY_RETRY, DEFAULT_QUERY_STALE_TIME } from './constants'

const useUpdateComments = (
  updateId: UpdateAttributes['id'],
  updateDiscourseTopicId: UpdateAttributes['discourse_topic_id'] | null
) => {
  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: [`updateComments#${updateId}`],
    queryFn: async () => {
      return Governance.get().getUpdateComments(updateId)
    },
    staleTime: DEFAULT_QUERY_STALE_TIME,
    retry: COMMENTS_QUERY_RETRY,
    enabled: !!updateDiscourseTopicId,
  })

  return { comments, isLoadingComments }
}

export default useUpdateComments
