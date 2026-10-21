export const DEFAULT_QUERY_STALE_TIME = 3.6e6 // 1 hour
export const TWENTY_MINUTES_MS = 1.2e6
export const FIVE_MINUTES_MS = 3e5
export const ONE_MINUTE_MS = 0.6e5
export const ONE_DAY_MS = 8.64e7
// comments come from the forum through a rate-limited api key and a list page asks for one topic per
// card, so retry a failed request once instead of react-query's default three
export const COMMENTS_QUERY_RETRY = 1
