/* eslint-disable prettier/prettier */
import 'semantic-ui-css/semantic.min.css'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { IntlProvider } from 'react-intl'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'

import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'

import SnapshotStatus from './components/Debug/SnapshotStatus'
import Layout from './components/Layout/Layout'
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
import SubmitCouncilDecisionVeto from './pages/submit/council-decision-veto'
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

import './utils/analytics/snippet'
// These CSS styles must be defined last to avoid overriding other styles
import 'balloon-css/balloon.min.css'
import 'decentraland-ui/dist/themes/base-theme.css'
import 'decentraland-ui/dist/themes/alternative/light-theme.css'
import './theme.css'
import './ui-overrides.css'
import useScrollToHash from './components/Home/useScrollToHash.tsx'
import { config } from './config/index.ts'
import { getAnalytics } from './utils/analytics/segment.ts'
import ProjectPage from './pages/project.tsx'

import {
  DclThemeProvider,
  lightTheme,
} from "decentraland-ui2"

getAnalytics()?.load(config.get('SEGMENT_KEY'))

const queryClient = new QueryClient()

const basename = /^decentraland.(zone|org|today)$/.test(window.location.host) ? '/governance' : '/'

const router = createBrowserRouter(
  [
    {
      element: <LayoutShell />,
      children: [
        { path: '*', element: <HomePage /> },
        { path: '/proposals', element: <ProposalsPage /> },
        { path: '/proposal', element: <ProposalPage /> },
        { path: '/projects', element: <ProjectsPage /> },
        { path: '/project', element: <ProjectPage /> },
        { path: '/update', element: <UpdateDetail /> },
        { path: '/edit/update', element: <UpdateEditPage /> },
        { path: '/submit', element: <SubmitPage /> },
        { path: '/submit/catalyst', element: <CatalystPage /> },
        { path: '/submit/poi', element: <Poi /> },
        { path: '/submit/ban-name', element: <SubmitBanName /> },
        { path: '/submit/linked-wearables', element: <SubmitLinkedWearables /> },
        { path: '/submit/grant', element: <SubmitGrant /> },
        { path: '/submit/hiring', element: <Hiring /> },
        { path: '/submit/council-decision-veto', element: <SubmitCouncilDecisionVeto /> },
        { path: '/submit/pitch', element: <SubmitPitchProposal /> },
        { path: '/submit/tender', element: <SubmitTenderProposal /> },
        { path: '/submit/bid', element: <SubmitBid /> },
        { path: '/submit/poll', element: <SubmitPoll /> },
        { path: '/submit/draft', element: <SubmitDraftProposal /> },
        { path: '/submit/governance', element: <SubmitGovernanceProposal /> },
        { path: '/submit/update', element: <SubmitUpdatePage /> },
        { path: '/profile', element: <ProfilePage /> },
        { path: '/transparency', element: <TransparencyPage /> },
        { path: '/debug', element: <DebugPage /> },
      ],
    },
  ],
  { basename }
)
const component = (
  <React.StrictMode>
    <AuthProvider sso={SSO_URL}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
)

function LayoutShell() {
  useScrollToHash()

  return (
      <IntlProvider defaultLocale="en" locale="en" messages={flattenMessages(en)}>
        <SnapshotStatus />
        <DclThemeProvider theme={lightTheme} >
          <Layout>
            <Outlet />
          </Layout>
        </DclThemeProvider>
      </IntlProvider>
  )
}

const rootElement = document.getElementById('root') as HTMLElement
const root = createRoot(rootElement)
root.render(component)
