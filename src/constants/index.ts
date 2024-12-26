import { ChainId } from '@dcl/schemas'

import { config } from '../config'
import Candidates from '../utils/delegates/candidates.json'

export const DISCOURSE_USER = config.get('DISCOURSE_USER')
export const DISCOURSE_API = config.get('DISCOURSE_API')
export const GOVERNANCE_URL = import.meta.env.VITE_GOVERNANCE_URL || config.get('GOVERNANCE_URL')
export const DOCS_URL = 'https://docs.decentraland.org/decentraland/what-is-the-dao/'
export const FORUM_URL = DISCOURSE_API
export const GOVERNANCE_API = import.meta.env.VITE_GOVERNANCE_API || config.get('GOVERNANCE_API')
export const DAO_DISCORD_URL = 'https://dcl.gg/dao-discord'
export const OPEN_CALL_FOR_DELEGATES_LINK = 'https://forum.decentraland.org/t/open-call-for-delegates-apply-now/5840'
export const CANDIDATE_ADDRESSES = Candidates.map((delegate) => delegate.address)
export const SEGMENT_KEY = config.get('SEGMENT_KEY') || ''
export const LOCAL_ENV_VAR = config.get('GATSBY_LOCAL_ENV_VAR') || ''
export const TEST_ENV_VAR = config.get('GATSBY_TEST_ENV_VAR') || ''
export const PROD_ENV_VAR = config.get('PROD_ENV_VAR') || ''
export const VOTES_VP_THRESHOLD = 5
export const SSO_URL = config.get('SSO_URL') ?? undefined
export const SNAPSHOT_STATUS_ENABLED = config.get('SNAPSHOT_STATUS_ENABLED') === 'true'
export const DEFAULT_CHAIN_ID = config.get('DEFAULT_CHAIN_ID', String(ChainId.ETHEREUM_MAINNET))
export const PUSH_CHANNEL_ID = config.get('PUSH_CHANNEL_ID')
export const BUY_LAND_URL = config.get('BUY_LAND_URL')
export const BUY_WEARABLES_URL = config.get('BUY_WEARABLES_URL')
export const BUY_NAME_URL = config.get('BUY_NAME_URL')
export const BUY_MANA_URL = config.get('BUY_MANA_URL')
export const DCL_META_IMAGE_URL = 'https://decentraland.org/images/decentraland.png'
export const JOIN_DISCORD_URL = config.get('JOIN_DISCORD_URL')
export const REASON_THRESHOLD = Number(config.get('REASON_THRESHOLD'))
export const TRANSPARENCY_API = config.get('DCL_DATA_API')
export const VESTING_DASHBOARD_URL = config.get('VESTING_DASHBOARD_URL')
export const GRANT_PROPOSAL_SUBMIT_ENABLED = false
export const PITCH_PROPOSAL_SUBMIT_ENABLED = false
export const LINKED_WEARABLES_PROPOSAL_SUBMIT_ENABLED = false
