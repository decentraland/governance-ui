# Decentraland Governance UI

[![Coverage Status](https://coveralls.io/repos/github/decentraland/governance-ui/badge.svg?branch=main)](https://coveralls.io/github/decentraland/governance-ui?branch=main)

The governance hub for the Decentraland DAO at governance.decentraland.org. Allows users to create, browse, and vote on proposals that shape the metaverse, track grant projects, and view DAO financial transparency data.

## Table of Contents

- [Features](#features)
- [Dependencies & Related Services](#dependencies--related-services)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [AI Agent Context](#ai-agent-context)

## Features

- **Proposal Browsing**: List and filter all DAO proposals by status, category, and search
- **Proposal Detail**: Full proposal view with vote breakdown, discussion, and linked updates
- **Proposal Submission**: Create new governance proposals (grant requests, policy changes, etc.)
- **Voting**: Cast votes on active proposals using wallet-signed transactions
- **Grant Project Tracking**: View funded projects and their progress updates
- **Transparency Page**: DAO financial data including grants awarded and treasury allocation
- **User Profile**: View voting history and participation stats for any address
- **Proposal Updates**: Authors submit progress updates linked to their proposals

## Dependencies & Related Services

- **Governance Backend** ([github.com/decentraland/governance](https://github.com/decentraland/governance)): all proposal, vote, and project data
- **Catalyst / Peer API** (`dcl-catalyst-client`): user profile and avatar data
- **Auth UI**: wallet sign-in before creating proposals or voting
- **Feature Flags Service** (`@dcl/feature-flags`): controls rollout of new governance features

### What This UI Does NOT Handle

- DAO treasury management (on-chain)
- Smart contract vote execution (done on-chain via snapshot or governance contracts)
- Rewards and grants disbursement (handled by separate reward systems)
- DAO landing/marketing page (dao-landing)

## Getting Started

### Prerequisites

- Node >=18
- npm

### Installation

```bash
npm install
```

### Configuration

Create a copy of `.env.example` and name it `.env.development`:

```bash
cp .env.example .env.development
```

### Running the UI

```bash
npm run start
```

## Testing

### Running Tests

```bash
npm test
```

Or with Jest options:

```bash
jest --no-cache --no-watchman --runInBand
```

The `--runInBand` parameter runs tests in a single thread. Add `--verbose` for more detailed output.

### Test Structure

Test files are co-located with source files, using the `*.test.ts` / `*.test.tsx` naming convention, run with Jest.

## AI Agent Context

For detailed AI Agent context, see [docs/ai-agent-context.md](docs/ai-agent-context.md).

---
