import { GRANT_VP_THRESHOLD } from '../constants/grants'
import {
  GRANT_PROPOSAL_MIN_BUDGET,
  GrantTierType,
  MAX_HIGH_TIER_PROJECT_DURATION,
  MAX_LOW_TIER_PROJECT_DURATION,
  MIN_HIGH_TIER_PROJECT_DURATION,
  MIN_LOW_TIER_PROJECT_DURATION,
} from '../types/grants'

import { isProdEnv } from './governanceEnvs'
import { isValidGrantBudget } from './grants'
import { getHighBudgetVpThreshold } from './projects'
import { asNumber } from './proposal'

const MAX_LOWER_TIER_GRANT_FUNDING = 20000

export enum TransparencyOneTimePaymentTier {
  Tier1 = 'Tier 1',
  Tier2 = 'Tier 2',
}

export class GrantTier {
  static getTypeFromBudget(budget: number) {
    if (!isValidGrantBudget(budget)) {
      throw new Error('Grant budget is not valid')
    }

    return budget >= GRANT_PROPOSAL_MIN_BUDGET && budget <= MAX_LOWER_TIER_GRANT_FUNDING
      ? GrantTierType.LowerTier
      : GrantTierType.HigherTier
  }

  static getVPThreshold(budget: number) {
    if (!isProdEnv() && GRANT_VP_THRESHOLD) {
      return asNumber(GRANT_VP_THRESHOLD)
    }
    const type = GrantTier.getTypeFromBudget(budget)
    switch (type) {
      case GrantTierType.HigherTier:
        return getHighBudgetVpThreshold(budget)
      case GrantTierType.LowerTier:
      default:
        return 2000000
    }
  }

  static getProjectDurationsLimits(budget: number): { min: number; max: number } {
    const type = GrantTier.getTypeFromBudget(budget)
    switch (type) {
      case GrantTierType.HigherTier:
        return { min: MIN_HIGH_TIER_PROJECT_DURATION, max: MAX_HIGH_TIER_PROJECT_DURATION }
      case GrantTierType.LowerTier:
      default:
        return { min: MIN_LOW_TIER_PROJECT_DURATION, max: MAX_LOW_TIER_PROJECT_DURATION }
    }
  }

  static isOneTimePaymentTier(type: GrantTierType | TransparencyOneTimePaymentTier) {
    switch (type) {
      case GrantTierType.Tier1:
      case GrantTierType.Tier2:
      case TransparencyOneTimePaymentTier.Tier1:
      case TransparencyOneTimePaymentTier.Tier2:
        return true
      default:
        return false
    }
  }
}
