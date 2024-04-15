import { config } from '../config'

// Shared frontend and backend constants
export const SNAPSHOT_SPACE = process.env.GATSBY_SNAPSHOT_SPACE || config.get('GATSBY_SNAPSHOT_SPACE') || ''
export const SNAPSHOT_ADDRESS = process.env.GATSBY_SNAPSHOT_ADDRESS || config.get('GATSBY_SNAPSHOT_ADDRESS') || ''
export const SNAPSHOT_DURATION = Number(
  process.env.GATSBY_SNAPSHOT_DURATION || config.get('GATSBY_SNAPSHOT_DURATION') || ''
)
export const SNAPSHOT_URL = process.env.GATSBY_SNAPSHOT_URL || config.get('GATSBY_SNAPSHOT_URL') || ''
export const SNAPSHOT_QUERY_ENDPOINT =
  process.env.GATSBY_SNAPSHOT_QUERY_ENDPOINT || config.get('GATSBY_SNAPSHOT_QUERY_ENDPOINT') || ''
export const SNAPSHOT_API = process.env.GATSBY_SNAPSHOT_API || config.get('GATSBY_SNAPSHOT_API') || ''

// Frontend-only constants
export const SNAPSHOT_DELEGATION_URL = `https://snapshot.org/#/delegate/${SNAPSHOT_SPACE}`
export const SNAPSHOT_DELEGATE_CONTRACT_ADDRESS = config.get('GATSBY_SNAPSHOT_DELEGATE_CONTRACT_ADDRESS')
