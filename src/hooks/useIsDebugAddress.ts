import { useQuery } from '@tanstack/react-query'

import { APIError } from '../clients/API'
import { Governance } from '../clients/Governance'

const ACCESS_DENIED_STATUSES = new Set([401, 403])

function isAccessDenied(error: unknown): error is APIError {
  return error instanceof APIError && ACCESS_DENIED_STATUSES.has(error.status)
}

export default function useIsDebugAddress(address?: string | null) {
  const normalizedAddress = address?.toLowerCase()
  const { data: isDebugAddress = false } = useQuery({
    queryKey: ['debugAccess', normalizedAddress],
    enabled: !!normalizedAddress,
    queryFn: async () => {
      try {
        const debugAddresses = await Governance.get().getDebugAddresses()
        return debugAddresses.includes(normalizedAddress!)
      } catch (error) {
        if (isAccessDenied(error)) {
          return false
        }
        throw error
      }
    },
    retry: (failureCount, error) => !isAccessDenied(error) && failureCount < 3,
    staleTime: Infinity,
    cacheTime: Infinity,
  })

  return { isDebugAddress }
}
