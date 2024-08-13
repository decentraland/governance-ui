import snakeCase from 'lodash/snakeCase'

import { SpecState } from '../components/Debug/UploadBadgeSpec'
import { GOVERNANCE_API } from '../constants'
import { HEROKU_APP_NAME } from '../constants/heroku'
import {
  DelegationResult,
  DetailedScores,
  PickedByResult,
  SnapshotConfig,
  SnapshotProposal,
  SnapshotSpace,
  SnapshotStatus,
  SnapshotVote,
  VpDistribution,
} from '../types/SnapshotTypes'
import { BadgeCreationResult, GovernanceBadgeSpec, RevokeOrReinstateResult, UserBadges } from '../types/badges'
import { BidRequest, UnpublishedBidAttributes } from '../types/bids'
import { Budget, BudgetWithContestants, CategoryBudget } from '../types/budgets'
import { CoauthorAttributes, CoauthorStatus } from '../types/coauthors'
import { ActivityTickerEvent, EventFilter } from '../types/events'
import { GrantRequest, ProposalGrantCategory } from '../types/grants'
import { NewsletterSubscriptionResult } from '../types/newsletter'
import { PushNotification } from '../types/notifications'
import { UserProject } from '../types/projects.ts'
import {
  NewProposalBanName,
  NewProposalCatalyst,
  NewProposalDraft,
  NewProposalGovernance,
  NewProposalHiring,
  NewProposalLinkedWearables,
  NewProposalPOI,
  NewProposalPitch,
  NewProposalPoll,
  NewProposalTender,
  PendingProposalsQuery,
  PersonnelAttributes,
  PriorityProposal,
  Project,
  ProjectInList,
  ProjectLink,
  ProjectMilestone,
  ProposalAttributes,
  ProposalCommentsInDiscourse,
  ProposalListFilter,
  ProposalStatus,
  ProposalWithProject,
} from '../types/proposals'
import { QuarterBudgetAttributes } from '../types/quarterBudgets'
import { SubscriptionAttributes } from '../types/subscriptions'
import { Topic } from '../types/surveyTopics'
import {
  UpdateAttributes,
  UpdateFinancialSection,
  UpdateGeneralSection,
  UpdateResponse,
  UpdateSubmissionDetails,
} from '../types/updates'
import { AccountType, UserProfile } from '../types/users'
import { Participation, VoteByAddress, VotedProposal, Voter, VotesForProposals } from '../types/votes'
import Time from '../utils/date/Time'

import API, { ApiOptions } from './API'
import { TransparencyBudget, TransparencyVesting } from './Transparency'
import { VestingWithLogs } from './VestingData'

type ApiResponse<D> = { ok: boolean; data: D }

type AirdropOutcome = Pick<AirdropJobAttributes, 'status' | 'error' | 'recipients' | 'badge_spec'>

enum AirdropJobStatus {
  PENDING = 'pending',
  FINISHED = 'finished',
  FAILED = 'failed',
}

type AirdropJobAttributes = {
  id: string
  badge_spec: string
  recipients: string[]
  status: AirdropJobStatus
  error?: string
  created_at: Date
  updated_at: Date
}

type NewProposalMap = {
  [`/proposals/poll`]: NewProposalPoll
  [`/proposals/draft`]: NewProposalDraft
  [`/proposals/governance`]: NewProposalGovernance
  [`/proposals/ban-name`]: NewProposalBanName
  [`/proposals/poi`]: NewProposalPOI
  [`/proposals/catalyst`]: NewProposalCatalyst
  [`/proposals/grant`]: GrantRequest
  [`/proposals/linked-wearables`]: NewProposalLinkedWearables
  [`/proposals/pitch`]: NewProposalPitch
  [`/proposals/tender`]: NewProposalTender
  [`/proposals/bid`]: BidRequest
  [`/proposals/hiring`]: NewProposalHiring
}

export type GetProposalsFilter = ProposalListFilter & {
  limit: number
  offset: number
}

const getGovernanceApiUrl = () => {
  if (HEROKU_APP_NAME) {
    return `https://governance.decentraland.vote/api`
  }

  return GOVERNANCE_API
}

export class Governance extends API {
  static Url = getGovernanceApiUrl()

  static Cache = new Map<string, Governance>()

  static from(baseUrl: string) {
    if (!this.Cache.has(baseUrl)) {
      this.Cache.set(baseUrl, new this(baseUrl))
    }

    return this.Cache.get(baseUrl)!
  }

  static get() {
    return this.from(this.Url)
  }

  async fetchApiResponse<T>(endpoint: string, options: ApiOptions = { method: 'GET', sign: false }): Promise<T> {
    return (await this.fetch<ApiResponse<T>>(endpoint, options)).data
  }

  static parseProposal<T extends ProposalAttributes>(proposal: T): T {
    return {
      ...proposal,
      start_at: Time.date(proposal.start_at),
      finish_at: Time.date(proposal.finish_at),
      updated_at: Time.date(proposal.updated_at),
      created_at: Time.date(proposal.created_at),
    }
  }

  static parsePriorityProposal(proposal: PriorityProposal): PriorityProposal {
    return {
      ...proposal,
      start_at: Time.date(proposal.start_at),
      finish_at: Time.date(proposal.finish_at),
    }
  }

  async getProposal(proposalId: string): Promise<ProposalWithProject | null> {
    const result = await this.fetch<ApiResponse<ProposalWithProject>>(`/proposals/${proposalId}`)
    return result.data
      ? {
          ...Governance.parseProposal(result.data),
          project_id: result.data?.project_id,
          project_status: result.data.project_status,
        }
      : null
  }

  async getProposals(filters: Partial<GetProposalsFilter> = {}) {
    const query = this.toQueryString(filters)

    const proposals = await this.fetch<ApiResponse<ProposalAttributes[]> & { total: number }>(`/proposals${query}`, {
      method: 'GET',
      sign: !!filters.subscribed,
    })

    return {
      ...proposals,
      data: proposals.data.map((proposal) => Governance.parseProposal(proposal)),
    }
  }

  async getProjectsList(from?: Date, to?: Date): Promise<ProjectInList[]> {
    const params = new URLSearchParams()
    if (from) {
      params.append('from', from.toISOString().split('T')[0])
    }
    if (to) {
      params.append('to', to.toISOString().split('T')[0])
    }
    const paramsStr = params.toString()
    return await this.fetchApiResponse<ProjectInList[]>(`/projects${paramsStr ? `?${paramsStr}` : ''}`)
  }

  async getProject(projectId: string) {
    return await this.fetchApiResponse<Project>(`/projects/${projectId}`)
  }

  async getOpenPitchesTotal() {
    return await this.fetch<{ total: number }>(`/projects/pitches-total`)
  }

  async getOpenTendersTotal() {
    return await this.fetch<{ total: number }>(`/projects/tenders-total`)
  }

  async getPriorityProposals(address?: string) {
    const url = `/proposals/priority/`
    const proposals = await this.fetch<PriorityProposal[]>(address && address.length > 0 ? url.concat(address) : url)
    return proposals.map((proposal) => Governance.parsePriorityProposal(proposal))
  }

  async getProjectsByUser(user: string) {
    return await this.fetchApiResponse<{ total: number; data: UserProject[] }>(`/projects/user/${user}`)
  }

  async createProposal<P extends keyof NewProposalMap>(path: P, proposal: NewProposalMap[P]) {
    return await this.fetchApiResponse<ProposalAttributes>(path, {
      method: 'POST',
      sign: true,
      json: proposal,
    })
  }

  async createProposalPoll(proposal: NewProposalPoll) {
    return this.createProposal(`/proposals/poll`, proposal)
  }

  async createProposalDraft(proposal: NewProposalDraft) {
    return this.createProposal(`/proposals/draft`, proposal)
  }

  async createProposalGovernance(proposal: NewProposalGovernance) {
    return this.createProposal(`/proposals/governance`, proposal)
  }

  async createProposalBanName(proposal: NewProposalBanName) {
    return this.createProposal(`/proposals/ban-name`, proposal)
  }

  async createProposalPOI(proposal: NewProposalPOI) {
    return this.createProposal(`/proposals/poi`, proposal)
  }

  async createProposalCatalyst(proposal: NewProposalCatalyst) {
    return this.createProposal(`/proposals/catalyst`, proposal)
  }

  async createProposalGrant(proposal: GrantRequest) {
    return this.createProposal(`/proposals/grant`, proposal)
  }

  async createProposalLinkedWearables(proposal: NewProposalLinkedWearables) {
    return this.createProposal(`/proposals/linked-wearables`, proposal)
  }

  async createProposalPitch(proposal: NewProposalPitch) {
    return this.createProposal(`/proposals/pitch`, proposal)
  }

  async createProposalTender(proposal: NewProposalTender) {
    return this.createProposal(`/proposals/tender`, proposal)
  }

  async createProposalBid(proposal: BidRequest) {
    return this.createProposal(`/proposals/bid`, proposal)
  }

  async createProposalHiring(proposal: NewProposalHiring) {
    return this.createProposal(`/proposals/hiring`, proposal)
  }

  async deleteProposal(proposal_id: string) {
    return await this.fetchApiResponse<boolean>(`/proposals/${proposal_id}`, { method: 'DELETE', sign: true })
  }

  async updateProposalStatus(proposal_id: string, status: ProposalStatus, vesting_addresses?: string[]) {
    const proposal = await this.fetchApiResponse<ProposalWithProject>(`/proposals/${proposal_id}`, {
      method: 'PATCH',
      sign: true,
      json: { status, vesting_addresses },
    })

    return Governance.parseProposal(proposal)
  }

  async getProjectUpdate(update_id: string) {
    return await this.fetchApiResponse<UpdateAttributes>(`/updates/${update_id}`)
  }

  async getProjectUpdates(project_id: string) {
    return await this.fetchApiResponse<UpdateResponse>(`/updates?project_id=${project_id}`)
  }

  async createProjectUpdate(
    project_id: string,
    update: UpdateSubmissionDetails & UpdateGeneralSection & UpdateFinancialSection
  ) {
    return await this.fetchApiResponse<UpdateAttributes>(`/updates`, {
      method: 'POST',
      sign: true,
      json: { project_id, ...update },
    })
  }

  async updateProjectUpdate(
    update_id: string,
    update: UpdateSubmissionDetails & UpdateGeneralSection & UpdateFinancialSection
  ) {
    return await this.fetchApiResponse<UpdateAttributes>(`/updates/${update_id}`, {
      method: 'PATCH',
      sign: true,
      json: update,
    })
  }

  async deleteProjectUpdate(update_id: UpdateAttributes['id']) {
    return await this.fetchApiResponse<UpdateAttributes>(`/updates/${update_id}`, {
      method: 'DELETE',
      sign: true,
    })
  }

  async getVotesByProposal(proposal_id: string) {
    return await this.fetchApiResponse<VoteByAddress>(`/proposals/${proposal_id}/votes`)
  }

  async getCachedVotesByProposals(proposal_ids: string[]) {
    if (proposal_ids.length === 0) {
      return {}
    }

    const params = proposal_ids.reduce((result, id) => {
      result.append('id', id)
      return result
    }, new URLSearchParams())

    return await this.fetchApiResponse<VotesForProposals>(`/votes?${params.toString()}`)
  }

  async getVotesAndProposalsByAddress(address: string, first?: number, skip?: number) {
    return await this.fetchApiResponse<VotedProposal[]>(`/votes/${address}?first=${first}&skip=${skip}`)
  }

  async getTopVotersForLast30Days() {
    return await this.fetchApiResponse<Voter[]>(`/votes/top-voters`)
  }

  async getParticipation() {
    return await this.fetchApiResponse<Participation>(`/votes/participation`)
  }

  async getUserSubscriptions() {
    return await this.fetchApiResponse<SubscriptionAttributes[]>(`/subscriptions`, { method: 'GET', sign: true })
  }

  async getSubscriptions(proposal_id: string) {
    return await this.fetchApiResponse<SubscriptionAttributes[]>(`/proposals/${proposal_id}/subscriptions`)
  }

  async subscribe(proposal_id: string) {
    return await this.fetchApiResponse<SubscriptionAttributes>(`/proposals/${proposal_id}/subscriptions`, {
      method: 'POST',
      sign: true,
    })
  }

  async unsubscribe(proposal_id: string) {
    return await this.fetchApiResponse<boolean>(`/proposals/${proposal_id}/subscriptions`, {
      method: 'DELETE',
      sign: true,
    })
  }

  async getCommittee() {
    return await this.fetchApiResponse<string[]>(`/committee`)
  }

  async getDebugAddresses() {
    return await this.fetchApiResponse<string[]>(`/debug`)
  }

  async getProposalComments(proposal_id: string) {
    return await this.fetchApiResponse<ProposalCommentsInDiscourse>(`/proposals/${proposal_id}/comments`)
  }

  async getProposalsByCoAuthor(address: string, status?: CoauthorStatus) {
    return await this.fetchApiResponse<CoauthorAttributes[]>(
      `/coauthors/proposals/${address}${status ? `/${status}` : ''}`
    )
  }

  async getCoAuthorsByProposal(id: string, status?: CoauthorStatus) {
    if (!id) {
      return []
    }
    return await this.fetchApiResponse<CoauthorAttributes[]>(`/coauthors/${id}${status ? `/${status}` : ''}`)
  }

  async updateCoauthorStatus(proposalId: string, status: CoauthorStatus) {
    return await this.fetchApiResponse<CoauthorAttributes>(`/coauthors/${proposalId}`, {
      method: 'PUT',
      sign: true,
      json: { status },
    })
  }

  async checkImage(imageUrl: string) {
    return await this.fetchApiResponse<boolean>(`/proposals/linked-wearables/image?url=${imageUrl}`)
  }

  async getCategoryBudget(category: ProposalGrantCategory): Promise<CategoryBudget> {
    return await this.fetchApiResponse<CategoryBudget>(`/budget/${snakeCase(category)}`)
  }

  async getTransparencyBudgets() {
    return await this.fetchApiResponse<TransparencyBudget[]>(`/budget/fetch`)
  }

  async getCurrentBudget() {
    return await this.fetchApiResponse<Budget>(`/budget/current`)
  }

  async getAllBudgets() {
    return await this.fetchApiResponse<Budget[]>(`/budget/all`)
  }

  async getBudgetWithContestants(proposalId: string) {
    return await this.fetchApiResponse<BudgetWithContestants>(`/budget/contested/${proposalId}`)
  }

  async updateGovernanceBudgets() {
    return await this.fetchApiResponse<QuarterBudgetAttributes[]>(`/budget/update`, {
      method: 'POST',
      sign: true,
    })
  }

  async reportErrorToServer(message: string, extraInfo?: Record<string, unknown>, options = { sign: true }) {
    return await this.fetchApiResponse<string>(`/debug/report-error`, {
      method: 'POST',
      json: { message, extraInfo },
      ...options,
    })
  }

  async triggerFunction(functionName: string) {
    return await this.fetchApiResponse<string>(`/debug/trigger`, {
      method: 'POST',
      sign: true,
      json: { functionName },
    })
  }

  async invalidateCache(key: string) {
    const params = new URLSearchParams()
    params.append('key', key)
    return await this.fetchApiResponse<number>(`/debug/invalidate-cache?${params.toString()}`, {
      method: 'DELETE',
      sign: true,
    })
  }

  async checkUrlTitle(url: string) {
    return await this.fetchApiResponse<{ title?: string }>(`/url-title`, { method: 'POST', json: { url } })
  }

  async getSurveyTopics(proposalId: string) {
    return await this.fetchApiResponse<Topic[]>(`/proposals/${proposalId}/survey-topics`)
  }

  async getValidationMessage(account?: AccountType) {
    const params = new URLSearchParams()
    if (account) {
      params.append('account', account)
    }
    return await this.fetchApiResponse<string>(`/user/validate?${params.toString()}`, {
      method: 'GET',
      sign: true,
    })
  }

  async validateForumProfile() {
    return await this.fetchApiResponse<{ valid: boolean }>('/user/validate/forum', { method: 'POST', sign: true })
  }

  async validateDiscordProfile() {
    return await this.fetchApiResponse<{ valid: boolean }>('/user/validate/discord', { method: 'POST', sign: true })
  }

  async isProfileValidated(address: string, accounts: AccountType[]) {
    const params = new URLSearchParams()
    for (const account of accounts) {
      params.append('account', account)
    }
    return await this.fetchApiResponse<boolean>(`/user/${address}/is-validated/?${params.toString()}`)
  }

  async isDiscordActive() {
    return await this.fetchApiResponse<boolean>(`/user/discord-active`, { method: 'GET', sign: true })
  }

  async isDiscordLinked() {
    return await this.fetchApiResponse<boolean>(`/user/discord-linked`, { method: 'GET', sign: true })
  }

  async updateDiscordStatus(is_discord_notifications_active: boolean) {
    return await this.fetchApiResponse<void>(`/user/discord-active`, {
      method: 'POST',
      sign: true,
      json: { is_discord_notifications_active },
    })
  }

  async getUserProfile(address: string) {
    return await this.fetchApiResponse<UserProfile>(`/user/${address}`)
  }

  async unlinkAccount(accountType: AccountType) {
    return await this.fetchApiResponse<boolean>(`/user/unlink`, {
      method: 'POST',
      sign: true,
      json: { accountType },
    })
  }

  async getBadges(address: string) {
    return await this.fetchApiResponse<UserBadges>(`/badges/${address}`)
  }

  async getCoreUnitsBadges() {
    return await this.fetchApiResponse<GovernanceBadgeSpec[]>(`/badges/core-units`)
  }

  async getBidsInfoOnTender(tenderId: string) {
    return await this.fetchApiResponse<{ is_submission_window_finished: boolean; publish_at: string }>(
      `/bids/${tenderId}`
    )
  }

  async getUserBidOnTender(tenderId: string, options = { sign: true }) {
    return await this.fetchApiResponse<Pick<
      UnpublishedBidAttributes,
      'author_address' | 'publish_at' | 'created_at'
    > | null>(`/bids/${tenderId}/get-user-bid`, { method: 'GET', ...options })
  }

  async getSnapshotConfigAndSpace(spaceName?: string) {
    return await this.fetchApiResponse<{ config: SnapshotConfig; space: SnapshotSpace }>(
      `/snapshot/config/${spaceName}`
    )
  }

  async getSnapshotStatus() {
    return await this.fetchApiResponse<SnapshotStatus>(`/snapshot/status`)
  }

  async getVotesByAddresses(addresses: string[]) {
    return await this.fetchApiResponse<SnapshotVote[]>(`/snapshot/votes/`, {
      method: 'POST',
      json: { addresses },
    })
  }

  async getVotesByProposalFromSnapshot(proposalId: string) {
    return await this.fetchApiResponse<SnapshotVote[]>(`/snapshot/votes/${proposalId}`)
  }

  async getSnapshotProposals(start: Date, end: Date, fields: (keyof SnapshotProposal)[]) {
    return await this.fetchApiResponse<Partial<SnapshotProposal>[]>(`/snapshot/proposals`, {
      method: 'POST',
      json: { start, end, fields },
    })
  }

  async getPendingProposals(query: PendingProposalsQuery) {
    return await this.fetchApiResponse<Partial<SnapshotProposal>[]>(`/snapshot/proposals/pending`, {
      method: 'POST',
      json: query,
    })
  }

  async getProposalScores(proposalSnapshotId: string) {
    return await this.fetchApiResponse<number[]>(`/snapshot/proposal-scores/${proposalSnapshotId}`)
  }

  async getVpDistribution(address: string, proposalSnapshotId?: string) {
    const snapshotId = proposalSnapshotId ? `/${proposalSnapshotId}` : ''
    const url = `/snapshot/vp-distribution/${address}${snapshotId}`
    return await this.fetchApiResponse<VpDistribution>(url)
  }

  async getScores(addresses: string[]) {
    return await this.fetchApiResponse<DetailedScores>('/snapshot/scores', { method: 'POST', json: { addresses } })
  }

  async getDelegations(address: string, blockNumber?: string | number) {
    return await this.fetchApiResponse<DelegationResult>(`/snapshot/delegations`, {
      method: 'POST',
      json: { address, blockNumber },
    })
  }

  async getPickedBy(addresses: string[]) {
    return await this.fetchApiResponse<PickedByResult[]>(`/snapshot/picked-by`, {
      method: 'POST',
      json: { addresses },
    })
  }

  async getAllVestings() {
    return await this.fetchApiResponse<TransparencyVesting[]>(`/all-vestings`)
  }

  async getVestings(addresses: string[]) {
    return await this.fetchApiResponse<VestingWithLogs[]>(`/vesting`, { method: 'POST', json: { addresses } })
  }

  async getUpdateComments(update_id: string) {
    return await this.fetchApiResponse<ProposalCommentsInDiscourse>(`/updates/${update_id}/comments`)
  }

  async airdropBadge(badgeSpecCid: string, recipients: string[]) {
    return await this.fetchApiResponse<AirdropOutcome>(`/badges/airdrop/`, {
      method: 'POST',
      sign: true,
      json: {
        badgeSpecCid,
        recipients,
      },
    })
  }

  async revokeBadge(badgeSpecCid: string, recipients: string[], reason?: string) {
    return await this.fetchApiResponse<RevokeOrReinstateResult[]>(`/badges/revoke/`, {
      method: 'POST',
      sign: true,
      json: {
        badgeSpecCid,
        recipients,
        reason,
      },
    })
  }

  async uploadBadgeSpec(spec: SpecState) {
    return await this.fetchApiResponse<BadgeCreationResult>(`/badges/upload-badge-spec/`, {
      method: 'POST',
      sign: true,
      json: {
        spec,
      },
    })
  }

  async createBadgeSpec(badgeCid: string) {
    return await this.fetchApiResponse<string>(`/badges/create-badge-spec/`, {
      method: 'POST',
      sign: true,
      json: {
        badgeCid,
      },
    })
  }

  async subscribeToNewsletter(email: string) {
    return await this.fetchApiResponse<NewsletterSubscriptionResult>(`/newsletter-subscribe`, {
      method: 'POST',
      json: {
        email,
      },
    })
  }

  async getUserNotifications(address: string) {
    return await this.fetchApiResponse<PushNotification[]>(`/notifications/user/${address}`)
  }

  async sendNotification(recipient: string, title: string, body: string, type: number, url: string) {
    return await this.fetchApiResponse<string>(`/notifications/send`, {
      method: 'POST',
      sign: true,
      json: {
        recipient,
        title,
        body,
        type,
        url,
      },
    })
  }

  async getUserLastNotification() {
    return await this.fetchApiResponse<number>(`/notifications/last-notification`, {
      method: 'GET',
      sign: true,
    })
  }

  async updateUserLastNotification(last_notification_id: number) {
    return await this.fetchApiResponse<string>(`/notifications/last-notification`, {
      method: 'POST',
      sign: true,
      json: { last_notification_id },
    })
  }

  async getLatestEvents(filters: Partial<EventFilter>) {
    const query = this.toQueryString(filters)
    return await this.fetchApiResponse<ActivityTickerEvent[]>(`/events${query}`)
  }

  async createVoteEvent(proposalId: string, proposalTitle: string, choice: string) {
    return await this.fetchApiResponse<string>(`/events/voted`, {
      method: 'POST',
      sign: true,
      json: { proposalId, proposalTitle, choice },
    })
  }

  async getAllEvents() {
    return await this.fetchApiResponse<ActivityTickerEvent[]>(`/events/all`, { method: 'GET', sign: true })
  }

  async getAllAirdropJobs() {
    return await this.fetchApiResponse<AirdropJobAttributes[]>(`/airdrops/all`, {
      method: 'GET',
      sign: true,
    })
  }

  async deletePersonnel(personnelId: PersonnelAttributes['id']) {
    return await this.fetchApiResponse<PersonnelAttributes['id'] | null>(`/projects/personnel/${personnelId}`, {
      method: 'DELETE',
      sign: true,
    })
  }

  async createPersonnel(personnel: PersonnelAttributes) {
    return await this.fetchApiResponse<PersonnelAttributes>(`/projects/personnel/`, {
      method: 'POST',
      sign: true,
      json: { personnel },
    })
  }

  async createMilestone(milestone: ProjectMilestone) {
    return await this.fetchApiResponse<ProjectMilestone>(`/projects/milestones/`, {
      method: 'POST',
      sign: true,
      json: { milestone },
    })
  }

  async deleteMilestone(milestoneId: ProjectMilestone['id']) {
    return await this.fetchApiResponse<PersonnelAttributes['id'] | null>(`/projects/milestones/${milestoneId}`, {
      method: 'DELETE',
      sign: true,
    })
  }

  async createProjectLink(projectLink: ProjectLink) {
    return await this.fetchApiResponse<ProjectLink>(`/projects/links/`, {
      method: 'POST',
      sign: true,
      json: { project_link: projectLink },
    })
  }

  async deleteProjectLink(projectLinkId: ProjectLink['id']) {
    return await this.fetchApiResponse<ProjectLink['id'] | null>(`/projects/links/${projectLinkId}`, {
      method: 'DELETE',
      sign: true,
    })
  }
}
