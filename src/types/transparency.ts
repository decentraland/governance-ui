export enum WalletStatus {
  // Under DAO control; funds are available to the DAO.
  Active = 'active',
  // Controlled by a third party (e.g. the former DAO Committee); funds are
  // NOT currently available to the DAO.
  Disputed = 'disputed',
}

export type TokenInWallet = {
  symbol: string
  contractAddress: string
  amount: bigint
  quote: bigint
  name: string
  network: string
  address: string
  timestamp: Date
  rate: number
  // Optional for backward compatibility with balances.json produced before the
  // transparency pipeline started emitting wallet status.
  status?: WalletStatus
}

export type TokenTotal = {
  symbol: string
  amount: bigint
  quote: bigint
}

export type AggregatedTokenBalance = {
  tokenTotal: TokenTotal
  tokenInWallets: TokenInWallet[]
}

export type BlockExplorerLink = {
  link: string
  name: string
}
