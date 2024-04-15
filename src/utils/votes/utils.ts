import upperFirst from 'lodash/upperFirst'
import isUUID from 'validator/lib/isUUID'

import { DelegationsLabelProps } from '../../components/Proposal/View/ProposalVoting/DelegationsLabel'
import { VotedChoice } from '../../components/Proposal/View/ProposalVoting/VotedChoiceButton'
import { VOTES_VP_THRESHOLD } from '../../constants'
import { SnapshotVote } from '../../types/SnapshotTypes'
import { ChoiceColor, Vote, VoteByAddress, VoteSegmentation } from '../../types/votes'

import { DelegationsLabelBuilder } from './helpers/DelegationsLabelBuilder'
import { VotedChoiceBuilder } from './helpers/VotedChoiceBuilder'

export interface VotingSectionConfigProps {
  vote: Vote | null
  delegateVote: Vote | null
  delegationsLabel: DelegationsLabelProps | null
  votedChoice: VotedChoice | null
  showChoiceButtons: boolean
}

export function getVotingSectionConfig(
  votes: VoteByAddress | null | undefined,
  choices: string[],
  delegate: string | null,
  delegators: string[] | null,
  account: string | null,
  ownVotingPower: number,
  delegatedVotingPower: number,
  voteDifference: number | null
): VotingSectionConfigProps {
  const vote = (account && votes?.[account]) || null
  const delegateVote = (delegate && votes?.[delegate]) || null
  const hasDelegators = !!delegators && delegators.length > 0
  const hasChoices = choices.length > 0

  if (!account || !hasChoices) {
    return {
      vote,
      delegateVote,
      showChoiceButtons: false,
      delegationsLabel: null,
      votedChoice: null,
    }
  }

  const votedChoice = new VotedChoiceBuilder(vote, delegateVote, choices, votes, account, delegate, delegators).build()
  const delegationsLabel = new DelegationsLabelBuilder(
    ownVotingPower,
    delegatedVotingPower,
    vote,
    delegate,
    delegateVote,
    voteDifference,
    delegators,
    votes
  ).build()

  return {
    vote,
    delegateVote,
    votedChoice: votedChoice || null,
    delegationsLabel: delegationsLabel || null,
    showChoiceButtons: !vote && (!delegate || !delegateVote || hasDelegators),
  }
}

export function getPartyVotes(
  delegators: string[],
  votes: VoteByAddress | null | undefined,
  choices: string[]
): { votesByChoices: Scores; totalVotes: number } {
  let totalVotes = 0
  const votesByChoices: Scores = {}

  if (delegators.length === 0) return { votesByChoices, totalVotes }

  choices.map((_value, index) => (votesByChoices[index] = 0))

  delegators.map((delegator) => {
    if (votes && votes[delegator]) {
      totalVotes += 1
      const choiceIndex = votes[delegator].choice - 1
      votesByChoices[choiceIndex] += 1
    }
  })

  return { votesByChoices, totalVotes }
}

export function formatChoice(choice: string) {
  return upperFirst(choice)
}

export type Scores = Record<string, number>
type VotesByAddress = Record<string, Vote[]>

export function toProposalIds(ids?: undefined | null | string | string[]) {
  if (!ids) {
    return []
  }

  const list = Array.isArray(ids) ? ids : [ids]

  return list.filter((id) => isUUID(String(id)))
}

function createVotes<T>(votes: SnapshotVote[], returnValue: (vote: Vote, prevValue?: T) => T): Record<string, T> {
  return votes.reduce((result, vote) => {
    const address = vote.voter.toLowerCase()
    const prevValue = result[address]
    result[address] = returnValue(
      {
        choice: vote.choice,
        vp: getFloorOrZero(vote.vp),
        timestamp: Number(vote.created),
        metadata: vote.metadata,
        reason: vote.reason,
      },
      prevValue
    )
    return result
  }, {} as Record<string, T>)
}

export function getVoteByAddress(votes: SnapshotVote[]): VoteByAddress {
  return createVotes(votes, (vote) => vote)
}

export function getVotesArrayByAddress(votes: SnapshotVote[]): VotesByAddress {
  return createVotes(votes, (vote, prevValue) => {
    if (prevValue) {
      return [...prevValue, vote]
    }

    return [vote]
  })
}

export function calculateResult(choices: string[], votes: VoteByAddress, requiredVotingPower = 0) {
  let totalPower = 0
  const balance: Scores = {}
  const choiceCount: Scores = {}
  for (const choice of choices) {
    balance[choice] = 0
    choiceCount[choice] = 0
  }

  const voters = Object.keys(votes || {})
  for (const voter of voters) {
    const vote = votes![voter]!
    if (vote) {
      totalPower += vote.vp
      balance[choices[vote.choice - 1]] += vote.vp
      choiceCount[choices[vote.choice - 1]] += 1
    }
  }

  let rest = 100
  let maxProgress = 0
  const totalPowerProgress = Math.max(totalPower, requiredVotingPower)
  const result = choices.map((choice, i) => {
    const color = calculateChoiceColor(choice, i)
    const power = balance[choice] || 0
    const votes = choiceCount[choice] || 0

    if (totalPower === 0) {
      return {
        choice,
        color,
        votes,
        power: 0,
        progress: 0,
      }
    }

    if (power === 0) {
      return {
        choice,
        color,
        votes,
        power: 0,
        progress: 0,
      }
    }

    if (power === totalPowerProgress) {
      return {
        choice,
        color,
        votes,
        power,
        progress: 100,
      }
    }

    let progress = Math.floor((power / totalPowerProgress) * 100)
    if (progress === 0) {
      progress = 1
    }

    rest -= progress

    if (progress > maxProgress) {
      maxProgress = progress
    }

    return {
      choice,
      power,
      votes,
      color,
      progress,
    }
  })

  if (rest !== 0 && rest !== 100 && totalPower >= requiredVotingPower) {
    const maxChoiceResults = result.filter((choiceResult) => choiceResult.progress === maxProgress)
    for (const choiceResult of maxChoiceResults) {
      choiceResult.progress += rest / maxChoiceResults.length
    }
  }

  return result
}

export function calculateChoiceColor(value: string, index: number): ChoiceColor {
  switch (value.toLowerCase()) {
    case 'yes':
    case 'for':
    case 'approve':
      return 'approve'

    case 'no':
    case 'against':
    case 'reject':
      return 'reject'

    default:
      return index % 8
  }
}

export function calculateResultWinner(choices: string[], votes: VoteByAddress, requiredVotingPower = 0) {
  const result = calculateResult(choices, votes, requiredVotingPower)

  return result.reduce((winner, current) => {
    if (winner.power < current.power) {
      return current
    }

    return winner
  }, result[0])
}

const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E']

export function abbreviateNumber(vp: number) {
  const tier = (Math.log10(Math.abs(vp)) / 3) | 0

  if (tier == 0) return vp

  const suffix = SI_SYMBOL[tier]
  const scale = Math.pow(10, tier * 3)

  const scaled = vp / scale

  return scaled.toFixed(1) + suffix
}

function getFloorOrZero(number?: number) {
  return Math.floor(number || 0)
}

export function getVoteSegmentation(votes: VoteByAddress | null | undefined): VoteSegmentation<Vote> {
  const highQualityVotes: VoteByAddress = {}
  const lowQualityVotes: VoteByAddress = {}

  if (votes) {
    Object.entries(votes).forEach(([address, vote]) => {
      if (vote.vp > VOTES_VP_THRESHOLD) {
        highQualityVotes[address] = vote
      } else {
        lowQualityVotes[address] = vote
      }
    })
  }

  return {
    highQualityVotes,
    lowQualityVotes,
  }
}
