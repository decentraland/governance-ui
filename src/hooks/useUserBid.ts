import { useQuery } from '@tanstack/react-query'

import { Governance } from '../clients/Governance'
import { useAuthContext } from '../context/AuthProvider.tsx'

function useUserBid(tenderId: string | null) {
  const [user] = useAuthContext()
  const { data: userBid } = useQuery({
    queryKey: [`userBid#${tenderId}`],
    queryFn: () => (tenderId ? Governance.get().getUserBidOnTender(tenderId, { sign: !!user }) : null),
  })

  return userBid ?? null
}

export default useUserBid
