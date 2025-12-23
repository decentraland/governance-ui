import { isbot } from 'isbot'

import type { SegmentAnalytics } from '../../types/analytics'

export function getAnalytics(): SegmentAnalytics | undefined {
  const userAgent = window.navigator.userAgent

  const isBot = isbot(userAgent)
  if (isBot) {
    return undefined
  }

  return window.analytics
}
