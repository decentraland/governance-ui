export type VestingLog = {
  topic: string
  timestamp: string
  amount?: number
}

export enum VestingStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Finished = 'Finished',
  Paused = 'Paused',
  Revoked = 'Revoked',
}

export type Vesting = {
  start_at: string
  finish_at: string
  released: number
  releasable: number
  vested: number
  total: number
  address: string
  status: VestingStatus
  token: string
}

export type VestingWithLogs = Vesting & { logs: VestingLog[] }
