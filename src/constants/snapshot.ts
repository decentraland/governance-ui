import { config } from '../config'

// Shared frontend and backend constants
export const SNAPSHOT_SPACE = config.get('SNAPSHOT_SPACE')
export const SNAPSHOT_ADDRESS = config.get('SNAPSHOT_ADDRESS') // TODO: possibly not used by frontend, remove
export const SNAPSHOT_DURATION = Number(config.get('SNAPSHOT_DURATION'))
export const SNAPSHOT_URL = config.get('SNAPSHOT_URL')
export const SNAPSHOT_QUERY_ENDPOINT = config.get('SNAPSHOT_QUERY_ENDPOINT')
export const SNAPSHOT_API = config.get('SNAPSHOT_API')

// Frontend-only constants
export const SNAPSHOT_DELEGATION_URL = `https://snapshot.org/#/delegate/${SNAPSHOT_SPACE}`
export const SNAPSHOT_DELEGATE_CONTRACT_ADDRESS = config.get('SNAPSHOT_DELEGATE_CONTRACT_ADDRESS')
