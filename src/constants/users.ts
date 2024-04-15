import { config } from '../config'

export const MESSAGE_TIMEOUT_TIME = 5 * 60 * 1000 // 5mins
export const DISCOURSE_CONNECT_THREAD = process.env.DISCOURSE_CONNECT_THREAD || config.get('DISCOURSE_CONNECT_THREAD')
export const DISCORD_PROFILE_VERIFICATION_URL =
  process.env.DISCORD_PROFILE_VERIFICATION_URL || config.get('DISCORD_PROFILE_VERIFICATION_URL')
