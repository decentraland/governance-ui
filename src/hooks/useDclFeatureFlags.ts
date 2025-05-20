import { useCallback } from 'react'

import { FeatureFlagOptions, fetchFlags } from '@dcl/feature-flags'
import { useQuery } from '@tanstack/react-query'

export default function useFeatureFlags(options = { applicationName: ['dao', 'dapps'] }) {
  const { data } = useQuery({
    queryKey: ['featureFlags'],
    queryFn: async () => {
      const ff = await fetchFlags(options as FeatureFlagOptions)
      return ff
    },
    refetchOnWindowFocus: false,
  })

  const isFeatureFlagEnabled = useCallback(
    (value: string) => {
      return !!data?.flags && !!data?.flags[value]
    },
    [data]
  )

  const getVariants = useCallback(
    (value: string) => {
      const payload = data?.variants?.[value]?.payload
      if (payload) {
        if (payload.type === 'json') {
          try {
            return JSON.parse(payload.value)
          } catch (error) {
            console.error('Error parsing JSON for feature flag', value, error)
            return undefined
          }
        }

        return payload.value
      }

      return undefined
    },
    [data]
  )

  return {
    data,
    isFeatureFlagEnabled,
    getVariants,
  }
}
