import { Vesting } from '../clients/VestingData.ts'

import { ProjectStatus } from './grants.ts'
import { PersonnelAttributes, ProposalAttributes } from './proposals.ts'
import { IndexedUpdate } from './updates.ts'

type ProposalDataForProject = Pick<
  ProposalAttributes,
  'enacting_tx' | 'enacted_description' | 'vesting_addresses' | 'type' | 'configuration' | 'user'
> & {
  proposal_created_at: Date
  proposal_updated_at: Date
}

export type OneTimePayment = {
  enacting_tx: string
  token?: string
  tx_amount?: number
}
export type ProjectFunding = {
  enacted_at?: string
  one_time_payment?: OneTimePayment
  vesting?: Vesting
}
export type ProjectAttributes = {
  id: string
  proposal_id: string
  title: string
  status: ProjectStatus
  about?: string
  about_updated_by?: string
  about_updated_at?: Date
  updated_at?: Date
  created_at: Date
}

export enum ProjectMilestoneStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Done = 'done',
}

export type ProjectMilestone = {
  id: string
  project_id: string
  title: string
  description: string
  delivery_date: Date | string
  status: ProjectMilestoneStatus
  updated_by?: string
  updated_at?: Date
  created_by: string
  created_at: Date
}

export type ProjectLink = {
  id: string
  project_id: string
  label: string
  url: string
  updated_by?: string
  updated_at?: Date
  created_by: string
  created_at: Date
}

export type Project = ProjectAttributes & {
  personnel: PersonnelAttributes[]
  links: ProjectLink[]
  milestones: ProjectMilestone[]
  author: string
  coauthors: string[] | null
  vesting_addresses: string[]
  funding?: ProjectFunding
  latest_update?: LatestUpdate
}

type LatestUpdate = {
  update?: IndexedUpdate | null
  update_timestamp?: number
}

export type ProjectInList = Pick<Project, 'id' | 'proposal_id' | 'status' | 'title' | 'author' | 'funding'> &
  Pick<ProposalAttributes, 'type' | 'configuration'> & {
    latest_update?: LatestUpdate
    created_at: number
    updated_at: number
  }

export type UserProject = Pick<
  Project,
  'id' | 'proposal_id' | 'status' | 'title' | 'author' | 'personnel' | 'coauthors' | 'funding'
> &
  ProposalDataForProject
