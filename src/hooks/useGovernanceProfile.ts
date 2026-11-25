import { useQuery } from '@tanstack/react-query'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

import { APIError } from '../clients/API'
import { ErrorClient } from '../clients/ErrorClient'
import { Governance } from '../clients/Governance'
import { useAuthContext } from '../context/AuthProvider.tsx'
import { ErrorCategory } from '../utils/errorCategories'
import { isBrowserNetworkError } from '../utils/errors'

import { DEFAULT_QUERY_STALE_TIME } from './constants'

function isNotFoundOrBadRequest(error: unknown) {
  return error instanceof APIError && (error.status === 404 || error.status === 400)
}

export default function useGovernanceProfile(profileAddress?: string | null) {
  const [address] = useAuthContext()
  const { data, isLoading: isLoadingGovernanceProfile } = useQuery({
    queryKey: [`userGovernanceProfile`, profileAddress],
    queryFn: async () => {
      if (!profileAddress || !isEthereumAddress(profileAddress)) return null

      try {
        return await Governance.get().getUserProfile(profileAddress)
      } catch (error) {
        // "Failed to fetch" here is the browser not reaching our own API (offline, aborted navigation, ad blocker).
        // An actual API outage is visible on the backend, so this isn't worth a report.
        if (!isNotFoundOrBadRequest(error) && !isBrowserNetworkError(error)) {
          ErrorClient.report(
            'Error getting governance profile',
            {
              error: `${error}`,
              address: profileAddress,
              category: ErrorCategory.Profile,
            },
            { sign: !!address }
          )
        }
        return null
      }
    },
    staleTime: DEFAULT_QUERY_STALE_TIME,
    enabled: !!profileAddress,
  })

  return { profile: data, isProfileValidated: !!data?.forum_id, isLoadingGovernanceProfile }
}
