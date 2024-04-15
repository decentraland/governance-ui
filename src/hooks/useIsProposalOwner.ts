import { useMemo } from 'react'

import { useAuthContext } from '../context/AuthProvider'
import { ProposalAttributes } from '../types/proposals'
import { isSameAddress } from '../utils/snapshot'

export default function useIsProposalOwner(proposal?: ProposalAttributes | null) {
  const [account] = useAuthContext()
  const isOwner = useMemo(() => isSameAddress(proposal?.user, account), [proposal, account])
  return { isOwner }
}
