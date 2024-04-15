import { useMemo } from 'react'

import { useAuthContext } from '../context/AuthProvider'
import { ProposalAttributes } from '../types/proposals'
import { isSameAddress } from '../utils/snapshot'
import { CoauthorStatus } from '..types/coauthors'

import useCoAuthorsByProposal from './useCoAuthorsByProposal'

export default function useIsProposalCoAuthor(proposal: ProposalAttributes | null) {
  const [account] = useAuthContext()
  const coauthorsByProposal = useCoAuthorsByProposal(proposal)
  const isCoauthor = useMemo(
    () =>
      !!coauthorsByProposal.find(
        (coauthor) => isSameAddress(coauthor.address, account) && coauthor.status === CoauthorStatus.APPROVED
      ),
    [coauthorsByProposal, account]
  )
  return { isCoauthor }
}
