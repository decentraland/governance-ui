/**
 * @jest-environment jsdom
 */

// Runs against the real decentraland-dapps snippet: only the config is mocked.
const WRITE_KEY = 'a-key'
const ANALYTICS_URL = `https://evs.example.com/analytics.js/v1/${WRITE_KEY}/analytics.min.js`
const API_HOST = 'api.example.com/v1'

const REAL_USER_AGENT = window.navigator.userAgent
const BOT_USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'

type TestAnalytics = Array<unknown[]> & {
  load: (key: string, options?: unknown) => void
  track: (event: string) => void
  _loadOptions?: unknown
}

function setUserAgent(userAgent: string) {
  Object.defineProperty(window.navigator, 'userAgent', { value: userAgent, configurable: true })
}

function getInjectedScripts() {
  return Array.from(document.querySelectorAll('script[data-global-segment-analytics-key]'))
}

// The snippet keeps its options in module state and installs itself on import, so every test needs a fresh copy
function setup(env: Record<string, string>) {
  let loadAnalytics: () => void = () => undefined
  jest.isolateModules(() => {
    jest.doMock('../../config', () => ({
      config: { get: (key: string, defaultValue?: string) => env[key] ?? defaultValue },
    }))
    require('decentraland-dapps/dist/modules/analytics/snippet')
    loadAnalytics = require('./load').loadAnalytics
  })
  return { loadAnalytics, analytics: window.analytics as unknown as TestAnalytics }
}

describe('loadAnalytics with the decentraland-dapps snippet', () => {
  beforeEach(() => {
    delete (window as { analytics?: unknown }).analytics
    document.head.innerHTML = '<script></script>'
  })

  afterEach(() => {
    setUserAgent(REAL_USER_AGENT)
    jest.dontMock('../../config')
  })

  describe('when the key and the proxy are configured', () => {
    let analytics: TestAnalytics

    beforeEach(() => {
      const result = setup({ SEGMENT_KEY: WRITE_KEY, SEGMENT_ANALYTICS_URL: ANALYTICS_URL, SEGMENT_API_HOST: API_HOST })
      analytics = result.analytics
      result.loadAnalytics()
    })

    it('should inject the script from the configured analytics url', () => {
      const scripts = getInjectedScripts()
      expect(scripts).toHaveLength(1)
      expect(scripts[0].getAttribute('src')).toBe(ANALYTICS_URL)
    })

    it('should deliver the events to the configured api host', () => {
      expect(analytics._loadOptions).toEqual({ integrations: { 'Segment.io': { apiHost: API_HOST } } })
    })
  })

  describe('when the proxy is not configured', () => {
    let analytics: TestAnalytics

    beforeEach(() => {
      const result = setup({ SEGMENT_KEY: WRITE_KEY })
      analytics = result.analytics
      result.loadAnalytics()
    })

    it('should fall back to the Segment cdn', () => {
      const scripts = getInjectedScripts()
      expect(scripts).toHaveLength(1)
      expect(scripts[0].getAttribute('src')).toBe(
        `https://cdn.segment.com/analytics.js/v1/${WRITE_KEY}/analytics.min.js`
      )
    })

    it('should not override the api host', () => {
      expect(analytics._loadOptions).toBeUndefined()
    })
  })

  describe('when the visitor is a bot', () => {
    beforeEach(() => {
      setUserAgent(BOT_USER_AGENT)
      const result = setup({ SEGMENT_KEY: WRITE_KEY, SEGMENT_ANALYTICS_URL: ANALYTICS_URL, SEGMENT_API_HOST: API_HOST })
      result.loadAnalytics()
    })

    it('should not inject the script', () => {
      expect(getInjectedScripts()).toHaveLength(0)
    })
  })

  describe('when there is no key', () => {
    beforeEach(() => {
      const result = setup({ SEGMENT_ANALYTICS_URL: ANALYTICS_URL, SEGMENT_API_HOST: API_HOST })
      result.loadAnalytics()
    })

    it('should not inject the script', () => {
      expect(getInjectedScripts()).toHaveLength(0)
    })
  })

  describe('when events are tracked before analytics is loaded', () => {
    let analytics: TestAnalytics

    beforeEach(() => {
      const result = setup({ SEGMENT_KEY: WRITE_KEY, SEGMENT_ANALYTICS_URL: ANALYTICS_URL, SEGMENT_API_HOST: API_HOST })
      analytics = result.analytics
      analytics.track('Early Event')
      result.loadAnalytics()
    })

    it('should keep the event in the queue to be replayed once analytics.js boots', () => {
      expect(analytics.filter(([method, name]) => method === 'track' && name === 'Early Event')).toHaveLength(1)
    })
  })
})
