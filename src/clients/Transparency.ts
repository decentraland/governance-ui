import { TRANSPARENCY_API } from '../constants'
import { ProjectStatus } from '../types/grants'
import { TokenInWallet } from '../types/transparency'
import { ErrorCategory } from '../utils/errorCategories'

import { ErrorClient } from './ErrorClient'

export type Detail = {
  name: string
  value: bigint
  description: string
}

export type MonthlyTotal = {
  total: bigint
  previous: bigint
  details: Detail[]
}

export type Member = {
  avatar: string
  address: string
  name: string
}

export enum CommitteeName {
  SAB = 'Security Advisory Board',
  DAOCommitee = 'DAO Committee',
  WearableCuration = 'Wearable Curation Committee',
  Revocation = 'Revocation Committee',
}

export type Committee = {
  name: CommitteeName
  size: number
  description: string
  members: Member[]
}

export type TransparencyData = {
  balances: TokenInWallet[]
  income: MonthlyTotal
  expenses: MonthlyTotal
  funding: {
    total: bigint
    budget: bigint
  }
  committees: Committee[]
}

export type TransparencyBudget = {
  start_date: string
  total: number
  category_percentages: Record<string, number>
}

export type TransparencyVesting = {
  proposal_id: string
  token: string
  vesting_address: string
  vesting_released: number
  vesting_releasable: number
  vesting_start_at: string
  vesting_finish_at: string
  vesting_contract_token_balance: number
  vesting_total_amount: number
  vesting_status: ProjectStatus
  duration_in_months: number
}

const EMPTY_API: TransparencyData = {
  balances: [],
  income: {
    total: BigInt(0),
    previous: BigInt(0),
    details: [],
  },
  expenses: {
    total: BigInt(0),
    previous: BigInt(0),
    details: [],
  },
  funding: {
    total: BigInt(0),
    budget: BigInt(0),
  },
  committees: [],
}

export class Transparency {
  static async getData() {
    try {
      const response = (await (await fetch(`${TRANSPARENCY_API}/api.json`)).json()) as TransparencyData
      return response
    } catch (error) {
      ErrorClient.report('Failed to fetch transparency data', { error, category: ErrorCategory.Transparency })
      return EMPTY_API
    }
  }

  static async getBudgets() {
    try {
      const response = (await (await fetch(`${TRANSPARENCY_API}/budgets.json`)).json()) as TransparencyBudget[]
      return response
    } catch (error) {
      ErrorClient.report('Failed to fetch transparency budgets data', { error, category: ErrorCategory.Transparency })
      return []
    }
  }

  static async getVestings() {
    try {
      const response = (await (await fetch(`${TRANSPARENCY_API}/vestings.json`)).json()) as TransparencyVesting[]
      return response
    } catch (error) {
      ErrorClient.report('Failed to fetch transparency vestings data', { error, category: ErrorCategory.Transparency })
      return []
    }
  }
}
