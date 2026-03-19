# AI Agent Context

**Service Purpose:**

The Governance UI (`governance.decentraland.org`) is the full-featured governance dApp for the Decentraland DAO. It lets community members browse, create, vote on, and track governance proposals, manage funded projects, view DAO transparency data, configure push/email notifications, and manage their governance profile. It is the frontend counterpart to the `governance` backend (github.com/decentraland/governance).

**Key Capabilities:**

- Proposal browsing: filterable, searchable, paginated list of all DAO proposals (`/proposals`)
- Proposal detail: full proposal view with voting, comments (Discourse), co-authors, sentiment survey, and result stance (`/proposal?id=...`)
- Proposal submission: type-specific submission forms for Poll, Draft, Governance, Grant, POI, Ban Name, Catalyst, Linked Wearables, Pitch, Tender, Bid, Hiring, Council Decision Veto (`/submit/*`)
- Proposal editing and project updates (`/edit`, `/update`)
- Governance profiles: per-address activity, VP, badges, delegations, votes cast (`/profile?address=...`)
- Projects dashboard: funded grant projects and their milestones/updates (`/projects`, `/project?id=...`)
- Transparency page: DAO treasury balances, vesting contract data, monthly spend totals, committee members (`/transparency`)
- Snapshot integration: VP snapshot voting, delegation contract interactions
- Push Protocol notifications (`@pushprotocol/restapi`) and newsletter subscriptions
- Discourse forum thread linking per proposal
- Legislative tracker component
- Storybook for UI component development

**Communication Pattern:**

- HTTP REST: all data fetched via `src/clients/Governance.ts`, a typed API client wrapping the governance backend at `GOVERNANCE_API`
- Additional REST clients: `src/clients/Transparency.ts` (on-chain transparency data), `src/clients/SnapshotApi.ts` and `src/clients/SnapshotGraphql.ts` (Snapshot Hub API and subgraph), `src/clients/VestingData.ts` (vesting contract), `src/clients/HttpStat.ts`
- React Query (`@tanstack/react-query`) used for data fetching in hooks
- Ethers.js for on-chain interactions (Snapshot delegation contract, vesting contracts)
- RPC service (`src/clients/RpcService.ts`) for low-level RPC calls
- No Redux for data fetching; Redux-Saga used for wallet/auth state (inherited from `decentraland-dapps`)

**Technology Stack:**

- Runtime: Node.js 18+ (TypeScript 5.2)
- Language: TypeScript
- Frontend framework: React 18 with Vite 4
- Routing: React Router v6
- State management: React context (`AuthProvider`) + React Query for server state; Redux-Saga for wallet
- UI libraries: `decentraland-ui`, `decentraland-ui2`
- Forms: `react-hook-form` + `@hookform/resolvers` + Zod validation
- Markdown: `@uiw/react-md-editor`, `react-markdown`, `remark-gfm`, `rehype-sanitize`, `dompurify`
- Charts: Chart.js + `react-chartjs-2` + `chartjs-plugin-annotation`
- Date utilities: dayjs, `dayjs-precise-range`
- Push notifications: `@pushprotocol/restapi`
- Snapshot voting: `@snapshot-labs/snapshot.js`
- Internationalisation: react-intl
- Testing: Jest 29 + `ts-jest` (Node environment)
- Storybook 7 for component stories
- Linting/formatting: ESLint + Prettier, Husky + lint-staged
- Build: Vite 4 with SWC

**External Dependencies:**

- `GOVERNANCE_API` (governance.decentraland.org/api) — all proposal, project, vote, profile, budget, badge, and subscription data
- `SNAPSHOT_API` / `SNAPSHOT_QUERY_ENDPOINT` — Snapshot Hub REST and subgraph GraphQL for VP and voting
- `DISCOURSE_API` (forum.decentraland.org) — forum thread fetching and linking
- `DCL_DATA_API` (decentraland-dao.github.io/transparency) — DAO transparency balances and team data
- `SSO_URL` (id.decentraland.org) — Decentraland SSO for identity sharing across dApps
- Snapshot delegation contract (`SNAPSHOT_DELEGATE_CONTRACT_ADDRESS`) — on-chain VP delegation
- `PUSH_CHANNEL_ID` — Push Protocol channel for DAO notifications
- `DISCORD_PROFILE_VERIFICATION_URL` — Discord linking for governance profiles
- Segment (`SEGMENT_KEY`) — analytics
- `VESTING_DASHBOARD_URL` — external vesting dashboard link

**Key Concepts:**

- **ProposalType**: Enum with many values: `Poll`, `Draft`, `Governance`, `Grant`, `POI`, `BanName`, `Catalyst`, `LinkedWearables`, `Pitch`, `Tender`, `Bid`, `Hiring`, `CouncilDecisionVeto`. Each type has a dedicated submission form under `src/pages/submit/`.
- **ProposalStatus**: `pending`, `active`, `finished`, `rejected`, `passed`, `enacted`, `out_of_budget`, `deleted`. Proposals transition through statuses based on Snapshot vote outcomes and DAO Council actions.
- **Voting Power (VP)**: VP is composed of MANA, LAND, estates, names, L1 wearables, rental, and delegated sources. `useVotingPowerInformation` and related hooks aggregate these. Snapshot is the authoritative source for VP at vote time.
- **Snapshot integration**: Proposals are created on Snapshot (`snapshot.dcl.eth` space). VP is read from Snapshot's API. Voting calls Snapshot's Hub API. The `SnapshotApi` and `SnapshotGraphql` clients wrap these interactions.
- **AuthProvider** (`src/context/AuthProvider.tsx`): Provides `[user, authState]` via `useAuthContext()`. Wraps `useAuth` (wallet connection via `decentraland-connect`) and initialises SSO via `@dcl/single-sign-on-client`.
- **Governance API client** (`src/clients/Governance.ts`): Central typed REST client. Methods cover proposals, votes, projects, budgets, co-authors, subscriptions, badges, grants, bids, updates, transparency, and more. All responses are typed against types in `src/types/`.
- **Projects**: Funded grant proposals become "projects" tracked with milestones, personnel, and periodic updates. `useProject`, `useProjects`, `useProjectUpdates` hooks; `Project*` components in `src/components/Projects/` and `src/components/Updates/`.
- **Budgets and categories**: The governance backend maintains quarterly budget allocations per grant category. `useBudgetByCategory`, `useCategoryBudget`, `useBudgetWithContestants` hooks surface this data.
- **Feature flags**: `@dcl/feature-flags` via `useDclFeatureFlags` hook. Controls things like grant submission availability (see `GRANT_PROPOSAL_SUBMIT_ENABLED`, `PITCH_PROPOSAL_SUBMIT_ENABLED` constants).
- **Maintenance mode**: `isUnderMaintenance()` utility checks the `MAINTENANCE` config flag and renders `MaintenanceLayout` when true.
- **Submission thresholds**: Minimum VP required to submit each proposal type is configured per type (e.g., `SUBMISSION_THRESHOLD_POLL=100`, `SUBMISSION_THRESHOLD_GRANT=100`, `SUBMISSION_THRESHOLD_GOVERNANCE=2500`).

**Out of Scope:**

- Proposal backend logic and vote tallying — handled by the `governance` backend (github.com/decentraland/governance)
- Snapshot voting infrastructure — handled by Snapshot Hub (external)
- User authentication and wallet connection — handled by `auth` (`decentraland.org/auth`)
- Account settings and MANA management — handled by `account` (`account.decentraland.org`)
- DAO marketing/intro content — handled by `dao-landing` (`dao.decentraland.org`)

**Project Structure:**

```
src/
  __mocks__/       Jest mocks (e.g., @dcl/ui-env mock)
  clients/         API clients: Governance.ts, Transparency.ts, SnapshotApi.ts,
                   SnapshotGraphql.ts, VestingData.ts, RpcService.ts, API.ts, etc.
  components/      Feature-grouped UI components:
                   Proposal/, Projects/, Updates/, Profile/, Delegation/,
                   Form/, GrantRequest/, BidRequest/, ProjectRequest/,
                   Comments/, Charts/, Notifications/, Transparency/,
                   Layout/, Common/, Search/, Filter/, Sidebar/, Modal/, etc.
  config/          @dcl/ui-env config; env JSONs in config/env/
  constants/       App-wide constants (API URLs, thresholds, candidate addresses)
  context/         AuthProvider, auth hooks (useAuth, useTransaction)
  helpers/         Utility helper functions
  hooks/           ~70 React hooks covering proposals, votes, VP, projects,
                   profiles, delegations, budgets, subscriptions, etc.
  images/          Static image assets
  intl/            i18n message definitions
  pages/           Route-level page components:
                   proposals.tsx, proposal.tsx, submit/, edit/, update.tsx,
                   profile.tsx, project.tsx, projects.tsx, transparency.tsx,
                   index.tsx, 404.tsx, debug.tsx
  stories/         Storybook stories
  types/           TypeScript type definitions for all domain objects
  utils/           Shared utility functions (dates, formatting, proposal logic, etc.)
```

**Configuration:**

Config uses `@dcl/ui-env` (`src/config/index.ts`). Only `dev` and `prod` environments are defined. Active environment set via `VITE_REACT_APP_DCL_DEFAULT_ENV`. Key variables from `src/config/env/prd.json`:

- `GOVERNANCE_API` — Governance backend API base URL
- `GOVERNANCE_URL` — Public URL of this app
- `SNAPSHOT_API` / `SNAPSHOT_SPACE` / `SNAPSHOT_QUERY_ENDPOINT` — Snapshot integration
- `DISCOURSE_API` / `DISCOURSE_USER` / `DISCOURSE_CONNECT_THREAD` — Forum integration
- `DCL_DATA_API` — Transparency data source
- `SSO_URL` — Decentraland SSO
- `DEFAULT_CHAIN_ID` — Ethereum chain (1 = mainnet)
- `PUSH_CHANNEL_ID` — Push Protocol channel
- `SEGMENT_KEY` — Analytics
- `SUBMISSION_THRESHOLD_*` — Per-type VP submission thresholds
- `SNAPSHOT_DELEGATE_CONTRACT_ADDRESS` — On-chain delegation contract
- `REASON_THRESHOLD` — VP threshold above which a vote reason is required
- `VESTING_DASHBOARD_URL` — External vesting dashboard

**Testing:**

Tests run with `npm test` (Jest 29, Node environment, `ts-jest` for TypeScript). `@dcl/ui-env` is mocked via `src/__mocks__/@dcl/ui-env.ts`. Test files are co-located as `.test.ts` files (e.g., `src/clients/utils.test.ts`, `src/hooks/useDelegation.test.ts`). Storybook is available via `npm run storybook` on port 6006.
