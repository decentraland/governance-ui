import { Project, ProposalAttributes } from './proposals.ts'

type ProposalDataForProject = Pick<
  ProposalAttributes,
  'enacting_tx' | 'enacted_description' | 'vesting_addresses' | 'type' | 'configuration' | 'user'
> & {
  proposal_created_at: Date
  proposal_updated_at: Date
}

export type UserProject = Pick<
  Project,
  'id' | 'proposal_id' | 'status' | 'title' | 'author' | 'personnel' | 'coauthors' | 'funding'
> &
  ProposalDataForProject
