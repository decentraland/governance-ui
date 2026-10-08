import { configureAnalyticsSnippet, getAnalyticsLoadOptions } from 'decentraland-dapps/dist/modules/analytics/snippet'

import { config } from '../../config'

import { getAnalytics } from './segment'

export function loadAnalytics() {
  const key = config.get('SEGMENT_KEY')
  const analytics = getAnalytics()
  if (!key || !analytics) {
    return
  }

  configureAnalyticsSnippet({
    analyticsUrl: config.get('SEGMENT_ANALYTICS_URL', '') || undefined,
    apiHost: config.get('SEGMENT_API_HOST', '') || undefined,
  })
  analytics.load(key, getAnalyticsLoadOptions())
}
