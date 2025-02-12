import { isbot } from 'isbot'

export interface AnalyticsWindow extends Window {
  analytics: SegmentAnalytics.AnalyticsJS
}

export function getAnalytics() {
  const userAgent = window.navigator.userAgent

  const isBot = isbot(userAgent)
  if (isBot) {
    return undefined
  }

  return (window as AnalyticsWindow).analytics
}
