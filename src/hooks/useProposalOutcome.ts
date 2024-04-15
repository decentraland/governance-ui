import { useQuery } from '@tanstack/react-query'

import { Governance } from '../clients/Governance'
import { ProposalAttributes } from '../types/proposals'
import { Scores } from '../utils/votes/utils'

import { FIVE_MINUTES_MS } from './constants'

function calculateWinnerChoice(result: Scores) {
  const winnerChoice = Object.keys(result)
    .filter((choice) => choice !== 'abstain')
    .reduce((winner, choice) => {
      if (!winner || result[winner] <= result[choice]) {
        return choice
      }
      return winner
    })
  const winnerVotingPower = Math.round(result[winnerChoice])
  return { winnerChoice, winnerVotingPower }
}

function getScoresResult(snapshotScores: number[], choices: string[]) {
  const result: Scores = {}
  if (!snapshotScores || !choices) {
    return result
  }

  for (const choice of choices) {
    result[choice] = snapshotScores[choices.indexOf(choice)]
  }
  return result
}

const useProposalOutcome = (snapshotId: ProposalAttributes['snapshot_id'], choices: string[]) => {
  const { data: scores, isLoading } = useQuery({
    queryKey: [`proposalScores#${snapshotId}`],
    queryFn: async () => Governance.get().getProposalScores(snapshotId),
    staleTime: FIVE_MINUTES_MS,
    enabled: !!snapshotId && !!choices,
  })

  const scoresResult = getScoresResult(scores || [], choices)
  const winnerChoice = scores ? calculateWinnerChoice(scoresResult) : null

  return { winnerVotingPower: winnerChoice?.winnerVotingPower, isLoadingOutcome: isLoading }
}

export default useProposalOutcome
