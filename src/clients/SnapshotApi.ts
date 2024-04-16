import { Web3Provider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'
import snapshot from '@snapshot-labs/snapshot.js'
import Client from '@snapshot-labs/snapshot.js/dist/sign'
import { ProposalType, Vote } from '@snapshot-labs/snapshot.js/dist/sign/types'

import { config } from '../config'
import { SNAPSHOT_SPACE } from '../constants/snapshot'

import { trimLastForwardSlash } from './utils'

const SNAPSHOT_PROPOSAL_TYPE: ProposalType = 'single-choice' // Each voter may select only one choice
const SNAPSHOT_APP_NAME = 'decentraland-governance'

export type SnapshotReceipt = {
  id: string
  ipfs: string
  relayer: {
    address: string
    receipt: string
  }
}

type CastVote = {
  account: Web3Provider | Wallet
  address: string
  proposalSnapshotId: string
  choiceNumber: number
  metadata?: string
  reason?: string
}

export class SnapshotApi {
  static Url = config.get('SNAPSHOT_API') || 'https://hub.snapshot.org'

  static Cache = new Map<string, SnapshotApi>()
  private readonly client: Client

  static from(baseUrl: string) {
    baseUrl = trimLastForwardSlash(baseUrl)
    if (!this.Cache.has(baseUrl)) {
      this.Cache.set(baseUrl, new this(baseUrl))
    }

    return this.Cache.get(baseUrl)!
  }

  constructor(baseUrl: string) {
    this.client = new snapshot.Client712(baseUrl)
  }

  private static getSpaceName() {
    if (!SNAPSHOT_SPACE) {
      throw new Error('Failed to determine snapshot space. Please check SNAPSHOT_SPACE env is defined')
    }
    return SNAPSHOT_SPACE
  }

  static get() {
    return this.from(config.get('SNAPSHOT_API', this.Url))
  }

  async castVote({
    account,
    address,
    proposalSnapshotId,
    choiceNumber,
    metadata,
    reason,
  }: CastVote): Promise<SnapshotReceipt> {
    const voteMessage: Vote = {
      space: SnapshotApi.getSpaceName(),
      proposal: proposalSnapshotId,
      type: SNAPSHOT_PROPOSAL_TYPE,
      choice: choiceNumber,
      metadata,
      reason,
      app: SNAPSHOT_APP_NAME,
    }
    return (await this.client.vote(account, address, voteMessage)) as SnapshotReceipt
  }
}
