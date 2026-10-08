import { configureAnalyticsSnippet, getAnalyticsLoadOptions } from 'decentraland-dapps/dist/modules/analytics/snippet'

import { config } from '../../config'

import { loadAnalytics } from './load'
import { getAnalytics } from './segment'

jest.mock('decentraland-dapps/dist/modules/analytics/snippet', () => ({
  configureAnalyticsSnippet: jest.fn(),
  getAnalyticsLoadOptions: jest.fn(),
}))
jest.mock('../../config', () => ({ config: { get: jest.fn() } }))
jest.mock('./segment', () => ({ getAnalytics: jest.fn() }))

const configGetMock = config.get as jest.Mock
const getAnalyticsMock = getAnalytics as jest.Mock
const getAnalyticsLoadOptionsMock = getAnalyticsLoadOptions as jest.Mock
const configureAnalyticsSnippetMock = configureAnalyticsSnippet as jest.Mock

const loadMock = jest.fn()
const LOAD_OPTIONS = { integrations: { 'Segment.io': { apiHost: 'api.example.com/v1' } } }

function mockConfig(values: Record<string, string>) {
  configGetMock.mockImplementation((key: string, defaultValue?: string) => values[key] ?? defaultValue)
}

describe('loadAnalytics', () => {
  beforeEach(() => {
    getAnalyticsMock.mockReturnValue({ load: loadMock })
    getAnalyticsLoadOptionsMock.mockReturnValue(LOAD_OPTIONS)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('when the key and the proxy are configured', () => {
    beforeEach(() => {
      mockConfig({
        SEGMENT_KEY: 'a-key',
        SEGMENT_ANALYTICS_URL: 'https://evs.example.com/analytics.js/v1/a-key/analytics.min.js',
        SEGMENT_API_HOST: 'api.example.com/v1',
      })
      loadAnalytics()
    })

    it('should configure the snippet with the analytics url and the api host', () => {
      expect(configureAnalyticsSnippetMock).toHaveBeenCalledWith({
        analyticsUrl: 'https://evs.example.com/analytics.js/v1/a-key/analytics.min.js',
        apiHost: 'api.example.com/v1',
      })
    })

    it('should load analytics with the key and the load options carrying the api host', () => {
      expect(loadMock).toHaveBeenCalledWith('a-key', LOAD_OPTIONS)
    })
  })

  describe('when the proxy values are empty', () => {
    beforeEach(() => {
      mockConfig({ SEGMENT_KEY: 'a-key', SEGMENT_ANALYTICS_URL: '', SEGMENT_API_HOST: '' })
      loadAnalytics()
    })

    it('should configure the snippet with undefined instead of empty strings', () => {
      expect(configureAnalyticsSnippetMock).toHaveBeenCalledWith({ analyticsUrl: undefined, apiHost: undefined })
    })
  })

  describe('when there is no key', () => {
    beforeEach(() => {
      mockConfig({ SEGMENT_KEY: '' })
      loadAnalytics()
    })

    it('should not load analytics', () => {
      expect(loadMock).not.toHaveBeenCalled()
    })

    it('should not configure the snippet', () => {
      expect(configureAnalyticsSnippetMock).not.toHaveBeenCalled()
    })
  })

  describe('when the visitor is a bot', () => {
    beforeEach(() => {
      mockConfig({ SEGMENT_KEY: 'a-key' })
      getAnalyticsMock.mockReturnValue(undefined)
      loadAnalytics()
    })

    it('should not configure the snippet', () => {
      expect(configureAnalyticsSnippetMock).not.toHaveBeenCalled()
    })
  })
})
