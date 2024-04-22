import { useQuery } from '@tanstack/react-query'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

import { ErrorClient } from '../clients/ErrorClient'
import { Governance } from '../clients/Governance'
import { useAuthContext } from '../context/AuthProvider.tsx'
import { ErrorCategory } from '../utils/errorCategories'

import { DEFAULT_QUERY_STALE_TIME } from './constants'

export default function useGovernanceProfile(profileAddress?: string | null) {
  const [address] = useAuthContext()
  const { data, isLoading: isLoadingGovernanceProfile } = useQuery({
    queryKey: [`userGovernanceProfile`, profileAddress],
    queryFn: async () => {
      if (!profileAddress || !isEthereumAddress(profileAddress)) return null

      try {
        return await Governance.get().getUserProfile(profileAddress)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.statusCode !== 404) {
          ErrorClient.report(
            'Error getting governance profile',
            {
              error,
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
