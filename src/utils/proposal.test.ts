import { ProposalStatus, ProposalType } from '../types/proposals'

import { canUpdateProposalEnactment, getProposalEnactmentStatusUpdate } from './proposal'

const proposal = (type: ProposalType, status: ProposalStatus) => ({ type, status })

describe('canUpdateProposalEnactment', () => {
  it('prevents new enactments for passed poll and draft proposals', () => {
    expect(canUpdateProposalEnactment(proposal(ProposalType.Poll, ProposalStatus.Passed))).toBe(false)
    expect(canUpdateProposalEnactment(proposal(ProposalType.Draft, ProposalStatus.Passed))).toBe(false)
  })

  it('allows undoing enactment for enacted poll and draft proposals', () => {
    expect(canUpdateProposalEnactment(proposal(ProposalType.Poll, ProposalStatus.Enacted))).toBe(true)
    expect(canUpdateProposalEnactment(proposal(ProposalType.Draft, ProposalStatus.Enacted))).toBe(true)
  })

  it('allows governance proposals to be enacted and undone', () => {
    expect(canUpdateProposalEnactment(proposal(ProposalType.Governance, ProposalStatus.Passed))).toBe(true)
    expect(canUpdateProposalEnactment(proposal(ProposalType.Governance, ProposalStatus.Enacted))).toBe(true)
  })

  it('allows non-poll/draft proposals to be enacted and undone', () => {
    expect(canUpdateProposalEnactment(proposal(ProposalType.POI, ProposalStatus.Passed))).toBe(true)
    expect(canUpdateProposalEnactment(proposal(ProposalType.POI, ProposalStatus.Enacted))).toBe(true)
    expect(canUpdateProposalEnactment(proposal(ProposalType.Grant, ProposalStatus.Passed))).toBe(true)
    expect(canUpdateProposalEnactment(proposal(ProposalType.Bid, ProposalStatus.Enacted))).toBe(true)
  })
})

describe('getProposalEnactmentStatusUpdate', () => {
  it('sends passed when undoing enactment for any proposal type', () => {
    expect(getProposalEnactmentStatusUpdate(proposal(ProposalType.Poll, ProposalStatus.Enacted))).toBe(
      ProposalStatus.Passed
    )
    expect(getProposalEnactmentStatusUpdate(proposal(ProposalType.Draft, ProposalStatus.Enacted))).toBe(
      ProposalStatus.Passed
    )
    expect(getProposalEnactmentStatusUpdate(proposal(ProposalType.Governance, ProposalStatus.Enacted))).toBe(
      ProposalStatus.Passed
    )
    expect(getProposalEnactmentStatusUpdate(proposal(ProposalType.POI, ProposalStatus.Enacted))).toBe(
      ProposalStatus.Passed
    )
    expect(getProposalEnactmentStatusUpdate(proposal(ProposalType.Grant, ProposalStatus.Enacted))).toBe(
      ProposalStatus.Passed
    )
  })

  it('sends enacted for new enactments', () => {
    expect(getProposalEnactmentStatusUpdate(proposal(ProposalType.Governance, ProposalStatus.Passed))).toBe(
      ProposalStatus.Enacted
    )
    expect(getProposalEnactmentStatusUpdate(proposal(ProposalType.POI, ProposalStatus.Passed))).toBe(
      ProposalStatus.Enacted
    )
  })
})
