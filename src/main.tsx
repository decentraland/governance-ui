import React from 'react'
import ReactDOM from 'react-dom'
import { IntlProvider } from 'react-intl'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'
import 'balloon-css/balloon.min.css'
// These CSS styles must be defined last to avoid overriding other styles
import 'core-js/features/set-immediate'
import 'decentraland-ui/dist/themes/alternative/light-theme.css'
import 'decentraland-ui/dist/themes/base-theme.css'
import 'semantic-ui-css/semantic.min.css'
import 'semantic-ui-css/semantic.min.css'

import SnapshotStatus from './components/Debug/SnapshotStatus'
import Layout from './components/Layout/Layout'
import AuthProvider from './context/AuthProvider'
import en from './intl/en.json'
import ProposalPage from './pages/proposal'
import ProposalsPage from './pages/proposals'
import TransparencyPage from './pages/transparency'
import { flattenMessages } from './utils/intl'

import { SSO_URL } from './constants'
import HomePage from './pages'
import './theme.css'
import './ui-overrides.css'

const queryClient = new QueryClient()

const basename = /^decentraland.(zone|org|today)$/.test(window.location.host) ? '/governance' : '/'
const component = (
  <React.StrictMode>
    <AuthProvider sso={SSO_URL}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={basename}>
          <IntlProvider defaultLocale="en" locale="en" messages={flattenMessages(en)}>
            <SnapshotStatus />
            <Layout>
              <Routes>
                <Route path="*" element={<HomePage />} />
                <Route path="/proposals" element={<ProposalsPage />} />
                <Route path="/proposal" element={<ProposalPage />} />
                <Route path="/transparency" element={<TransparencyPage />} />
              </Routes>
            </Layout>
          </IntlProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
    {/* {SEGMENT_KEY && <Segment key="segment" segmentKey={SEGMENT_KEY} />} */}
  </React.StrictMode>
)

ReactDOM.render(component, document.getElementById('root') as HTMLElement)
