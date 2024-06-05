import { BID_MIN_PROJECT_DURATION } from '../constants/bids'
import { MILESTONE_SUBMIT_LIMIT } from '../constants/proposals'

import {
  BudgetBreakdownConcept,
  GrantRequestDueDiligenceSchema,
  GrantRequestTeamSchema,
  Milestone,
  MilestoneItemSchema,
  ProposalRequestTeam,
} from './grants'

export enum UnpublishedBidStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
}

type BidProposalData = Omit<BidRequest, 'linked_proposal_id'>

export type UnpublishedBidAttributes = {
  id: number
  created_at: string
  linked_proposal_id: string
  author_address: string
  bid_proposal_data: BidProposalData
  publish_at: string
  status: UnpublishedBidStatus
}

export type UnpublishedBidInfo = Pick<
  UnpublishedBidAttributes,
  'id' | 'publish_at' | 'author_address' | 'linked_proposal_id'
>

export type BidRequestFunding = {
  funding: string | number
  projectDuration: number
  deliveryDate: string
  beneficiary: string
  email: string
}

export type BidRequestGeneralInfo = {
  teamName: string
  deliverables: string
  roadmap: string
  milestones: Milestone[]
  coAuthors?: string[]
}

export type BidRequestDueDiligence = {
  budgetBreakdown: BudgetBreakdownConcept[]
}

export type BidRequest = BidRequestFunding &
  BidRequestGeneralInfo &
  ProposalRequestTeam &
  BidRequestDueDiligence & {
    linked_proposal_id: string
    coAuthors?: string[]
  }

export const BidRequestFundingSchema = {
  funding: {
    type: 'integer',
    minimum: 100,
    maximum: 240000,
  },
  projectDuration: {
    type: 'integer',
    minimum: BID_MIN_PROJECT_DURATION,
    maximum: 12,
  },
  deliveryDate: {
    type: 'string',
  },
  beneficiary: {
    type: 'string',
    format: 'address',
  },
  email: {
    type: 'string',
    format: 'email',
  },
}

export const BidRequestGeneralInfoSchema = {
  teamName: {
    type: 'string',
    minLength: 1,
    maxLength: 80,
  },
  deliverables: {
    type: 'string',
    minLength: 20,
    maxLength: 1500,
  },
  roadmap: {
    type: 'string',
    minLength: 20,
    maxLength: 1500,
  },
  milestones: {
    type: 'array',
    items: {
      type: 'object',
      additionalProperties: false,
      required: [...Object.keys(MilestoneItemSchema)],
      properties: MilestoneItemSchema,
      maxItems: MILESTONE_SUBMIT_LIMIT,
    },
  },
  coAuthors: {
    type: 'array',
    items: {
      type: 'string',
      minLength: 42,
      maxLength: 42,
    },
  },
}

export const BidRequestSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'linked_proposal_id',
    ...Object.keys(BidRequestFundingSchema),
    ...Object.keys(BidRequestGeneralInfoSchema).filter((section) => section !== 'coAuthors'),
    ...Object.keys(GrantRequestTeamSchema),
    ...Object.keys(GrantRequestDueDiligenceSchema),
  ],
  properties: {
    linked_proposal_id: {
      type: 'string',
      minLength: 36,
      maxLength: 255,
    },
    ...BidRequestFundingSchema,
    ...BidRequestGeneralInfoSchema,
    ...GrantRequestTeamSchema,
    ...GrantRequestDueDiligenceSchema,
  },
}
