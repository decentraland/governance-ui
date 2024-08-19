import { useQuery } from '@tanstack/react-query'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

import { Governance } from '../clients/Governance'

import { DEFAULT_QUERY_STALE_TIME } from './constants.ts'

function useProjectsByUser(address?: string | null) {
  const { data: projects } = useQuery({
    queryKey: ['proposalProjectsByUser', address],
    queryFn: () => (!!address && isEthereumAddress(address) ? Governance.get().getProjectsByUser(address) : null),
    staleTime: DEFAULT_QUERY_STALE_TIME,
    enabled: !!address,
  })

  return { projects: projects?.data || null, total: projects?.total }
}

export default useProjectsByUser
