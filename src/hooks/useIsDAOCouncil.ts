import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Governance } from '../clients/Governance'

import { DEFAULT_QUERY_STALE_TIME } from './constants'

export default function useIsDAOCouncil(address?: string | null) {
  const { data: councilAddresses } = useQuery({
    queryKey: ['dao-council'],
    queryFn: () => Governance.get().getDAOCouncil(),
    staleTime: DEFAULT_QUERY_STALE_TIME,
  })

  const isDAOCouncil = useMemo(() => {
    return !!(address && councilAddresses && councilAddresses.includes(address))
  }, [address, councilAddresses])

  return { isDAOCouncil }
}
