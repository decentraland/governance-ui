import Time from '../utils/date/Time'

export const GRANT_VP_THRESHOLD = import.meta.env.VITE_GRANT_VP_THRESHOLD // Testing variable
export const MAX_LOWER_TIER_GRANT_FUNDING = 20000
export const BUDGETING_START_DATE = Time.utc('2023-01-01 00:00:00Z').toDate()
