import { ChainId } from '@dcl/schemas'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

import { config } from '../config'
import Candidates from '../utils/delegates/candidates.json'

export function trimOtterspaceId(rawId: string) {
  const parts = rawId.split(':')
  if (parts.length === 2) {
    return parts[1]
  }
  return ''
}

export const DAO_VESTING_CONTRACT_ADDRESS = '0x7a3abf8897f31b56f09c6f69d074a393a905c1ac'
export const GOVERNANCE_URL = process.env.GATSBY_GOVERNANCE_URL || 'https://decentraland.zone/governance'
export const DOCS_URL = 'https://docs.decentraland.org/decentraland/what-is-the-dao/'
export const FORUM_URL = process.env.GATSBY_DISCOURSE_API || config.get('GATSBY_DISCOURSE_API') || ''
export const GOVERNANCE_API = process.env.GATSBY_GOVERNANCE_API || config.get('GATSBY_GOVERNANCE_API') || ''
export const DAO_DISCORD_URL = 'https://dcl.gg/dao-discord'
export const OPEN_CALL_FOR_DELEGATES_LINK = 'https://forum.decentraland.org/t/open-call-for-delegates-apply-now/5840'
export const CANDIDATE_ADDRESSES = Candidates.map((delegate) => delegate.address)
export const DAO_ROLLBAR_TOKEN = process.env.DAO_ROLLBAR_TOKEN
export const SEGMENT_KEY = config.get('GATSBY_SEGMENT_KEY') || ''
export const LOCAL_ENV_VAR = config.get('GATSBY_LOCAL_ENV_VAR') || ''
export const TEST_ENV_VAR = config.get('GATSBY_TEST_ENV_VAR') || ''
export const PROD_ENV_VAR = config.get('GATSBY_PROD_ENV_VAR') || ''
export const VOTES_VP_THRESHOLD = 5
export const SSO_URL = config.get('GATSBY_SSO_URL') ?? undefined
export const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY || ''
export const TOP_VOTERS_PER_MONTH = 3
export const TOP_VOTER_BADGE_IMG_URL = process.env.TOP_VOTER_BADGE_IMG_URL || ''
export const LEGISLATOR_BADGE_SPEC_CID = process.env.LEGISLATOR_BADGE_SPEC_CID || ''
export const LAND_OWNER_BADGE_SPEC_CID = process.env.LAND_OWNER_BADGE_SPEC_CID || ''
export const DISCOURSE_WEBHOOK_SECRET = process.env.DISCOURSE_WEBHOOK_SECRET || ''
export const ALCHEMY_DELEGATIONS_WEBHOOK_SECRET = process.env.ALCHEMY_DELEGATIONS_WEBHOOK_SECRET || ''
export const CORE_UNITS_BADGE_CID = [
  'bafyreidmzou4wiy2prxq4jdyg66z7s3wulpfq2a7ar6sdkrixrj3b5mgwe', // Governance Squad
  'bafyreih5t62qmeiugca6bp7dtubrd3ponqfndbim54e3vg4cfbroledohq', // Grant Support Squad
  'bafyreicsrpymlwm4hutebi2qio3e5hhzpqtyr6fv3ei6nsybb3vannhfgy', // Facilitation Squad
]
export const DEBUG_ADDRESSES = (process.env.DEBUG_ADDRESSES || '')
  .split(',')
  .filter(isEthereumAddress)
  .map((address) => address.toLowerCase())

export const SNAPSHOT_STATUS_ENABLED = config.get('SNAPSHOT_STATUS_ENABLED') === 'true'
export const SNAPSHOT_STATUS_MAX_ERROR_BUFFER_SIZE = Number(process.env.SNAPSHOT_STATUS_MAX_ERROR_BUFFER_SIZE || 30)
export const SNAPSHOT_STATUS_ERROR_RATE_THRESHOLD = Number(process.env.SNAPSHOT_STATUS_ERROR_RATE_THRESHOLD || 0.33)
export const DEFAULT_CHAIN_ID =
  process.env.GATSBY_DEFAULT_CHAIN_ID || config.get('GATSBY_DEFAULT_CHAIN_ID', String(ChainId.ETHEREUM_MAINNET))
export const PUSH_CHANNEL_ID = process.env.GATSBY_PUSH_CHANNEL_ID || config.get('GATSBY_PUSH_CHANNEL_ID')

export const BUY_LAND_URL = process.env.GATSBY_BUY_LAND_URL || config.get('GATSBY_BUY_LAND_URL')
export const BUY_WEARABLES_URL = process.env.GATSBY_BUY_WEARABLES_URL || config.get('GATSBY_BUY_WEARABLES_URL')
export const BUY_NAME_URL = process.env.GATSBY_BUY_NAME_URL || config.get('GATSBY_BUY_NAME_URL')
export const BUY_MANA_URL = process.env.GATSBY_BUY_MANA_URL || config.get('GATSBY_BUY_MANA_URL')

export const DCL_META_IMAGE_URL = 'https://decentraland.org/images/decentraland.png'
export const JOIN_DISCORD_URL = config.get('GATSBY_JOIN_DISCORD_URL') || 'https://dcl.gg/discord'
export const BLOCKNATIVE_API_KEY = process.env.BLOCKNATIVE_API_KEY || ''
export const REASON_THRESHOLD = Number(process.env.GATSBY_REASON_THRESHOLD || config.get('GATSBY_REASON_THRESHOLD'))
