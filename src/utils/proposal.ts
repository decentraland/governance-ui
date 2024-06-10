import {
  getCatalystServersFromCache,
  getNameDenylistFromCache,
  getPoisFromCache,
} from 'dcl-catalyst-client/dist/contracts-snapshots'
import 'isomorphic-fetch'
import numeral from 'numeral'

import { Governance } from '../clients/Governance'
import { DISCOURSE_API, GOVERNANCE_API } from '../constants'
import { MAX_NAME_SIZE, MIN_NAME_SIZE } from '../constants/proposals'
import { SNAPSHOT_SPACE, SNAPSHOT_URL } from '../constants/snapshot'
import { getEnumDisplayName } from '../helpers'
import {
  CatalystType,
  PoiType,
  PriorityProposal,
  PriorityProposalType,
  ProposalAttributes,
  ProposalStatus,
  ProposalType,
  SortingOrder,
} from '../types/proposals'
import { UpdateAttributes } from '../types/updates'
import { VotesForProposals } from '../types/votes'
import Time from '../utils/date/Time'

import { getTile } from './Land'
import { isSameAddress } from './snapshot.ts'

export const MAX_PROPOSAL_LIMIT = 100
export const REGEX_NAME = new RegExp(`^([a-zA-Z0-9]){${MIN_NAME_SIZE},${MAX_NAME_SIZE}}$`)

export const CLIFF_PERIOD_IN_DAYS = 29

export function formatBalance(value: number | bigint) {
  return numeral(value).format('0,0')
}

export function isValidName(name: string) {
  return REGEX_NAME.test(name)
}

export function isValidDomainName(domain: string) {
  return new RegExp('^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$').test(domain)
}

export async function isValidImage(imageUrl: string) {
  return await Governance.get().checkImage(imageUrl)
}

export function isAlreadyBannedName(name: string) {
  return !!getNameDenylistFromCache('mainnet').find(
    (bannedName: string) => bannedName.toLowerCase() === name.toLowerCase()
  )
}

export async function isAlreadyPointOfInterest(x: number, y: number) {
  const pois = getPoisFromCache('polygon').map((poi) => poi.split(','))
  return !!pois.find((position) => position[0] === String(x) && position[1] === String(y))
}

export async function isValidPointOfInterest(x: number, y: number) {
  const tile = await getTile([x, y])
  if (!tile) {
    return false
  }

  switch (tile?.type) {
    case 'road':
      return false
    default:
      return true
  }
}

export function isAlreadyACatalyst(domain: string) {
  return !!getCatalystServersFromCache('mainnet').find((server) => server.address === 'https://' + domain)
}

export function asNumber(value: string | number): number {
  switch (typeof value) {
    case 'number':
      return value
    case 'string':
      return value === '' ? NaN : Number(value)
    default:
      return NaN
  }
}

export function snapshotUrl(hash: string) {
  const target = new URL(SNAPSHOT_URL)
  target.pathname = ''
  target.hash = hash
  return target.toString()
}

export function snapshotProposalUrl(proposal: Pick<ProposalAttributes, 'snapshot_id' | 'snapshot_space'>) {
  return snapshotUrl(`#/${proposal.snapshot_space}/proposal/${proposal.snapshot_id}`)
}

export function forumUrl(
  discourse_topic_slug: ProposalAttributes['discourse_topic_slug'] | UpdateAttributes['discourse_topic_slug'],
  discourse_topic_id: ProposalAttributes['discourse_topic_id'] | UpdateAttributes['discourse_topic_id']
) {
  const target = new URL(DISCOURSE_API || '')
  target.pathname = `/t/${discourse_topic_slug}/${discourse_topic_id}`
  return target.toString()
}

export function forumUserUrl(username: string) {
  const target = new URL(DISCOURSE_API || '')
  target.pathname = `/u/${username}`
  return target.toString()
}

export function proposalUrl(id: ProposalAttributes['id']) {
  const params = new URLSearchParams({ id })
  const target = new URL(GOVERNANCE_API)
  target.pathname = '/proposal/'
  target.search = '?' + params.toString()
  return target.toString()
}

export function projectUrl(id: string) {
  const params = new URLSearchParams({ id })
  const target = new URL(GOVERNANCE_API)
  target.pathname = '/projects/'
  target.search = '?' + params.toString()
  return target.toString()
}

export const EDIT_DELEGATE_SNAPSHOT_URL = snapshotUrl(`#/delegate/${SNAPSHOT_SPACE}`)

export function userModifiedForm(stateValue?: Record<string, unknown>, initialState?: Record<string, unknown>) {
  if (!stateValue || !initialState) {
    return false
  }
  const isInitialState = JSON.stringify(stateValue) === JSON.stringify(initialState)
  return !isInitialState && Object.values(stateValue).some((value) => !!value)
}

export function isProposalInCliffPeriod(enactedDate: string) {
  const now = Time.utc()
  return Time(enactedDate).add(CLIFF_PERIOD_IN_DAYS, 'day').isAfter(now)
}

export function isGovernanceProcessProposal(type: ProposalType) {
  return type === ProposalType.Poll || type === ProposalType.Draft || type === ProposalType.Governance
}

export function isBiddingAndTenderingProposal(type: ProposalType) {
  return type === ProposalType.Pitch || type === ProposalType.Tender || type === ProposalType.Bid
}

export function isProposalStatus(value: string | null | undefined): boolean {
  switch (value) {
    case ProposalStatus.Pending:
    case ProposalStatus.Finished:
    case ProposalStatus.Active:
    case ProposalStatus.Rejected:
    case ProposalStatus.Passed:
    case ProposalStatus.OutOfBudget:
    case ProposalStatus.Enacted:
    case ProposalStatus.Deleted:
      return true
    default:
      return false
  }
}

function toCustomType<FinalType, OrElse, ValueType>(
  value: ValueType,
  isType: (value: ValueType) => boolean,
  orElse: () => OrElse
): FinalType | OrElse {
  return isType(value) ? (value as unknown as FinalType) : orElse()
}

function isProposalType(value: string | null | undefined): boolean {
  if (value === null || value === undefined) {
    return false
  }

  return Object.values(ProposalType).includes(value as ProposalType)
}

function isPoiType(value: string | null | undefined): boolean {
  switch (value) {
    case PoiType.AddPOI:
    case PoiType.RemovePOI:
      return true
    default:
      return false
  }
}

function isCatalystType(value: string | null | undefined): boolean {
  switch (value) {
    case CatalystType.Add:
    case CatalystType.Remove:
      return true
    default:
      return false
  }
}

function isSortingOrder(value: string | null | undefined): boolean {
  switch (value) {
    case SortingOrder.ASC:
    case SortingOrder.DESC:
      return true
    default:
      return false
  }
}

export function toProposalStatus<OrElse>(value: string | null | undefined, orElse: () => OrElse) {
  return toCustomType<ProposalStatus, OrElse, typeof value>(value, isProposalStatus, orElse)
}

export function toCatalystType<OrElse>(value: string | null | undefined, orElse: () => OrElse) {
  return toCustomType<CatalystType, OrElse, typeof value>(value, isCatalystType, orElse)
}

export function toProposalType<OrElse>(value: string | null | undefined, orElse: () => OrElse) {
  return toCustomType<ProposalType, OrElse, typeof value>(value, isProposalType, orElse)
}

export function toPoiType<OrElse>(value: string | null | undefined, orElse: () => OrElse) {
  return toCustomType<PoiType, OrElse, typeof value>(value, isPoiType, orElse)
}

export function toSortingOrder<OrElse>(value: string | null | undefined, orElse: () => OrElse) {
  return toCustomType<SortingOrder, OrElse, typeof value>(value, isSortingOrder, orElse)
}

export function isProposalDeletable(proposalStatus?: ProposalStatus) {
  return proposalStatus === ProposalStatus.Active || proposalStatus === ProposalStatus.Pending
}

export function isProposalEnactable(proposalStatus: ProposalStatus) {
  return proposalStatus === ProposalStatus.Passed || proposalStatus === ProposalStatus.Enacted
}

export function proposalCanBePassedOrRejected(proposalStatus?: ProposalStatus) {
  return proposalStatus === ProposalStatus.Finished
}

export function getProposalStatusShortName(status: ProposalStatus) {
  return status === ProposalStatus.OutOfBudget ? 'OOB' : getEnumDisplayName(status)
}

export function isGrantProposalSubmitEnabled(now: number) {
  const ENABLE_START_DATE = Time.utc('2023-03-01').add(8, 'hour')
  return !Time(now).isBefore(ENABLE_START_DATE)
}

export function hasTenderProcessStarted(tenderProposals?: ProposalAttributes[]) {
  return !!tenderProposals && tenderProposals.length > 0 && Time(tenderProposals[0].start_at).isBefore(Time())
}

export function getBudget(proposal: ProposalAttributes) {
  const { type, configuration } = proposal
  switch (type) {
    case ProposalType.Grant:
      return Number(configuration.size)
    case ProposalType.Bid:
      return Number(configuration.funding)
    default:
      return null
  }
}

export function getDisplayedPriorityProposals(
  votes?: VotesForProposals,
  priorityProposals?: PriorityProposal[],
  lowerAddress?: string | null
) {
  if (!votes || !priorityProposals || !lowerAddress) {
    return priorityProposals
  }

  return priorityProposals?.filter((proposal) => {
    const hasVotedOnMain = votes && lowerAddress && votes[proposal.id] && !!votes[proposal.id][lowerAddress]
    const hasVotedOnLinked =
      proposal.linked_proposals_data &&
      proposal.linked_proposals_data.some(
        (linkedProposal) => votes[linkedProposal.id] && !!votes[linkedProposal.id][lowerAddress]
      )
    const hasAuthoredBid =
      proposal.unpublished_bids_data &&
      proposal.unpublished_bids_data.some((linkedBid) => isSameAddress(linkedBid.author_address, lowerAddress))

    const shouldDisregardAllVotes = proposal.priority_type === PriorityProposalType.PitchWithSubmissions

    const shouldDisregardVotesOnMain =
      proposal.priority_type === PriorityProposalType.PitchOnTenderVotingPhase ||
      proposal.priority_type === PriorityProposalType.TenderWithSubmissions

    const showTheProposal =
      shouldDisregardAllVotes ||
      !((hasVotedOnMain && !shouldDisregardVotesOnMain) || hasVotedOnLinked || hasAuthoredBid)
    return showTheProposal
  })
}

export function isProjectProposal(proposalType?: ProposalType) {
  return proposalType === ProposalType.Grant || proposalType === ProposalType.Bid
}
