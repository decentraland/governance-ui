import type { ProposalPageState } from '../../pages/proposal'
import { isSnapshotNoVotingPowerError, isUserRejectedError } from '../errors'
import { isSameAddress } from '../snapshot'

export const MAX_ERRORS_BEFORE_SNAPSHOT_REDIRECT = 3

export enum CastVoteFailure {
  /** The user dismissed the wallet prompt */
  Dismissed = 'dismissed',
  /** Snapshot rejected the vote because the account had no VP at the proposal's snapshot block */
  NoVotingPower = 'no_voting_power',
  /** Anything else, which may work on a retry */
  Failed = 'failed',
}

/**
 * `signer` is the wallet account that signed the vote, `account` the one the page shows. A "no voting power" rejection
 * is only about the account on the page when both are the same address.
 */
export function getCastVoteFailure(error: unknown, signer: string, account: string): CastVoteFailure {
  if (isUserRejectedError(error)) {
    return CastVoteFailure.Dismissed
  }
  if (isSnapshotNoVotingPowerError(error) && isSameAddress(signer, account)) {
    return CastVoteFailure.NoVotingPower
  }
  return CastVoteFailure.Failed
}

/**
 * `errorCount` is how many earlier failures counted towards the Snapshot redirect. Only a failure that may work on a
 * retry shows the retry countdown and counts: retrying can't give an account VP at a past block.
 */
export function getPageStateAfterCastVoteFailure(
  failure: CastVoteFailure,
  prevState: ProposalPageState,
  errorCount: number
): ProposalPageState {
  switch (failure) {
    case CastVoteFailure.Dismissed:
      return { ...prevState, changingVote: false }
    case CastVoteFailure.NoVotingPower:
      return { ...prevState, changingVote: false, showVotingModal: false, showBidVotingModal: false }
    case CastVoteFailure.Failed:
      return {
        ...prevState,
        changingVote: false,
        showVotingError: true,
        showSnapshotRedirect: errorCount + 1 >= MAX_ERRORS_BEFORE_SNAPSHOT_REDIRECT,
      }
  }
}
