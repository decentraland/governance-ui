jest.mock('./src/constants/heroku', () => ({
  HEROKU_APP_NAME: 'test',
}))
jest.mock('./src/constants/grants', () => ({
  GRANT_VP_THRESHOLD: null,
  MAX_LOWER_TIER_GRANT_FUNDING: 20000,
}))
jest.mock('./src/constants/index.ts', () => ({
  GOVERNANCE_API: 'governance_api',
}))
