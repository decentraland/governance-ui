export interface SegmentAnalytics {
  track(event: string, properties?: Record<string, unknown>, callback?: () => void): SegmentAnalytics
  load(key: string, options?: unknown): void
  page(name?: string, properties?: Record<string, unknown>, options?: unknown, callback?: () => void): SegmentAnalytics
}

declare global {
  interface Window {
    analytics?: SegmentAnalytics
  }
}
