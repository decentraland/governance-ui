import { config } from '../config'

export const SNAPSHOT_SPACE = config.get('SNAPSHOT_SPACE')
export const SNAPSHOT_DURATION = Number(config.get('SNAPSHOT_DURATION'))
export const SNAPSHOT_URL = config.get('SNAPSHOT_URL')
export const SNAPSHOT_API = config.get('SNAPSHOT_API')
export const SNAPSHOT_DELEGATION_URL = `https://snapshot.org/#/delegate/${SNAPSHOT_SPACE}`
export const SNAPSHOT_DELEGATE_CONTRACT_ADDRESS = config.get('SNAPSHOT_DELEGATE_CONTRACT_ADDRESS')
