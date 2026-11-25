import { ErrorCode, Logger } from '@ethersproject/logger'

import type { ProposalPageState } from '../../pages/proposal'

import {
  CastVoteFailure,
  MAX_ERRORS_BEFORE_SNAPSHOT_REDIRECT,
  getCastVoteFailure,
  getPageStateAfterCastVoteFailure,
} from './castVoteFailure'

const ACCOUNT = '0x2ac89522cb415ac333e64f52a1a5693218cebd58'
const SIGNER = '0x2AC89522CB415AC333E64F52a1a5693218cEBD58'
const OTHER_ACCOUNT = '0xc5f705ca8f70acc5f3d3db9636558102f528a475'
const SNAPSHOT_NO_VP = { error: 'client_error', error_description: 'no voting power' }
const SNAPSHOT_PINNING_FAILED = { error: 'client_error', error_description: 'pinning failed' }

const PREV_STATE = {
  changingVote: true,
  showVotingModal: true,
  showBidVotingModal: true,
  showVotingError: false,
  showSnapshotRedirect: false,
  retryTimer: 5,
} as ProposalPageState

describe('getCastVoteFailure', () => {
  it('tells a dismissed wallet prompt apart', () => {
    const rejection = new Logger('providers/5.8.0').makeError('user rejected signing', ErrorCode.ACTION_REJECTED)

    expect(getCastVoteFailure(rejection, SIGNER, ACCOUNT)).toBe(CastVoteFailure.Dismissed)
  })

  it('tells a "no voting power" rejection for the account on the page apart, whatever the address casing', () => {
    expect(getCastVoteFailure(SNAPSHOT_NO_VP, SIGNER, ACCOUNT)).toBe(CastVoteFailure.NoVotingPower)
  })

  it('treats a "no voting power" rejection as a plain failure when another wallet account signed', () => {
    expect(getCastVoteFailure(SNAPSHOT_NO_VP, OTHER_ACCOUNT, ACCOUNT)).toBe(CastVoteFailure.Failed)
  })

  it('treats any other error as a failure that may work on a retry', () => {
    expect(getCastVoteFailure(SNAPSHOT_PINNING_FAILED, SIGNER, ACCOUNT)).toBe(CastVoteFailure.Failed)
    expect(getCastVoteFailure(new TypeError('Failed to fetch'), SIGNER, ACCOUNT)).toBe(CastVoteFailure.Failed)
  })
})

describe('getPageStateAfterCastVoteFailure', () => {
  describe('when Snapshot answered "no voting power"', () => {
    const state = getPageStateAfterCastVoteFailure(
      CastVoteFailure.NoVotingPower,
      PREV_STATE,
      MAX_ERRORS_BEFORE_SNAPSHOT_REDIRECT - 1
    )

    it('closes the voting modals', () => {
      expect(state).toEqual(expect.objectContaining({ showVotingModal: false, showBidVotingModal: false }))
    })

    it('shows no retry countdown and takes no step towards the Snapshot redirect', () => {
      expect(state).toEqual(expect.objectContaining({ showVotingError: false, showSnapshotRedirect: false }))
    })

    it('stops changing the vote', () => {
      expect(state.changingVote).toBe(false)
    })
  })

  describe('when the user dismissed the wallet prompt', () => {
    it('only stops changing the vote', () => {
      expect(getPageStateAfterCastVoteFailure(CastVoteFailure.Dismissed, PREV_STATE, 0)).toEqual({
        ...PREV_STATE,
        changingVote: false,
      })
    })
  })

  describe('when the vote failed for another reason', () => {
    it('shows the retry countdown', () => {
      expect(getPageStateAfterCastVoteFailure(CastVoteFailure.Failed, PREV_STATE, 0)).toEqual(
        expect.objectContaining({ showVotingError: true, showSnapshotRedirect: false, changingVote: false })
      )
    })

    it('sends the user to Snapshot once it reaches the failure limit', () => {
      expect(
        getPageStateAfterCastVoteFailure(CastVoteFailure.Failed, PREV_STATE, MAX_ERRORS_BEFORE_SNAPSHOT_REDIRECT - 1)
          .showSnapshotRedirect
      ).toBe(true)
    })
  })
})
