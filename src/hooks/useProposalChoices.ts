import { useMemo } from 'react'

import { ProposalAttributes } from '../types/proposals'

function useProposalChoices(proposal?: Pick<ProposalAttributes, 'snapshot_proposal'> | null) {
  return useMemo((): string[] => proposal?.snapshot_proposal?.choices || [], [proposal])
}

export default useProposalChoices
