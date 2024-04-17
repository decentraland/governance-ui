/* eslint-disable prettier/prettier */
import React from 'react'
import ReactDOM from 'react-dom'
import { IntlProvider } from 'react-intl'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'
// These CSS styles must be defined last to avoid overriding other styles
import 'balloon-css/balloon.min.css'
import 'decentraland-ui/dist/themes/alternative/light-theme.css'
import 'decentraland-ui/dist/themes/base-theme.css'
import 'semantic-ui-css/semantic.min.css'

import SnapshotStatus from './components/Debug/SnapshotStatus'
import Layout from './components/Layout/Layout'
import Segment from './components/Segment'
import AuthProvider from './context/AuthProvider'
import en from './intl/en.json'
import DebugPage from './pages/debug'
import UpdateEditPage from './pages/edit/update'
import ProfilePage from './pages/profile'
import ProjectsPage from './pages/projects'
import ProposalPage from './pages/proposal'
import ProposalsPage from './pages/proposals'
import SubmitPage from './pages/submit'
import SubmitBanName from './pages/submit/ban-name'
import SubmitBid from './pages/submit/bid'
import CatalystPage from './pages/submit/catalyst'
import SubmitDraftProposal from './pages/submit/draft'
import SubmitGovernanceProposal from './pages/submit/governance'
import SubmitGrant from './pages/submit/grant'
import Hiring from './pages/submit/hiring'
import SubmitLinkedWearables from './pages/submit/linked-wearables'
import SubmitPitchProposal from './pages/submit/pitch'
import Poi from './pages/submit/poi'
import SubmitPoll from './pages/submit/poll'
import SubmitTenderProposal from './pages/submit/tender'
import SubmitUpdatePage from './pages/submit/update'
import TransparencyPage from './pages/transparency'
import UpdateDetail from './pages/update'
import { flattenMessages } from './utils/intl'

import { SSO_URL } from './constants'
import HomePage from './pages'
import './theme.css'
import './ui-overrides.css'

const queryClient = new QueryClient()

const basename = /^decentraland.(zone|org|today)$/.test(window.location.host) ? '/governance-ui' : '/'
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
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/update" element={<UpdateDetail />} />
                <Route path="/edit/update" element={<UpdateEditPage />} />
                <Route path="/submit" element={<SubmitPage />} />
                <Route path="/submit/catalyst" element={<CatalystPage />} />
                <Route path="/submit/poi" element={<Poi />} />
                <Route path="/submit/ban-name" element={<SubmitBanName />} />
                <Route path="/submit/linked-wearables" element={<SubmitLinkedWearables />} />
                <Route path="/submit/grant" element={<SubmitGrant />} />
                <Route path="/submit/hiring" element={<Hiring />} />
                <Route path="/submit/pitch" element={<SubmitPitchProposal />} />
                <Route path="/submit/tender" element={<SubmitTenderProposal />} />
                <Route path="/submit/bid" element={<SubmitBid />} />
                <Route path="/submit/poll" element={<SubmitPoll />} />
                <Route path="/submit/draft" element={<SubmitDraftProposal />} />
                <Route path="/submit/governance" element={<SubmitGovernanceProposal />} />
                <Route path="/submit/update" element={<SubmitUpdatePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/transparency" element={<TransparencyPage />} />
                <Route path="/debug" element={<DebugPage />} />
              </Routes>
            </Layout>
          </IntlProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
    <Segment />
  </React.StrictMode>
)

ReactDOM.render(component, document.getElementById('root') as HTMLElement)
