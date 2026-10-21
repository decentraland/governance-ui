import { AggregatedTokenBalance, BlockExplorerLink, TokenInWallet } from '../types/transparency'

import logger from './logger'

function alphabeticalSort(a: string, b: string) {
  return ('' + a).localeCompare(b)
}

function balanceSort(a: bigint, b: bigint) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export function aggregateBalances(latestBalances: TokenInWallet[]): AggregatedTokenBalance[] {
  const tokenBalances: AggregatedTokenBalance[] = []
  latestBalances.map((balance) => {
    const tokenBalance = tokenBalances.find((tokenBalance) => tokenBalance.tokenTotal.symbol == balance.symbol)
    if (!tokenBalance) {
      tokenBalances.push({
        tokenTotal: {
          symbol: balance.symbol,
          amount: balance.amount,
          quote: balance.quote,
        },
        tokenInWallets: [balance],
      })
    } else {
      tokenBalance.tokenTotal.amount = tokenBalance.tokenTotal.amount + balance.amount
      tokenBalance.tokenTotal.quote = tokenBalance.tokenTotal.quote + balance.quote
      tokenBalance.tokenInWallets.push(balance)
    }
  })

  for (const tokenBalance of tokenBalances) {
    tokenBalance.tokenInWallets.sort((a, b) => alphabeticalSort(a.name, b.name))
  }
  // by USD value: token amounts aren't comparable across tokens (1.7 cbBTC is worth more than 87k DAI)
  tokenBalances.sort((a, b) => balanceSort(a.tokenTotal.quote, b.tokenTotal.quote))
  return tokenBalances
}

// Tokens worth less than this are left out of the balance cards, e.g. dust or airdropped tokens with a
// tiny price. They still count towards the consolidated treasury total.
export const MIN_DISPLAYED_BALANCE_USD = 1

export function getDisplayedBalances(balances: AggregatedTokenBalance[]): AggregatedTokenBalance[] {
  return balances.filter((balance) => Number(balance.tokenTotal.quote) >= MIN_DISPLAYED_BALANCE_USD)
}

const ETHERSCAN_BASE_URL = 'https://etherscan.io/'
export const POLYGONSCAN_BASE_URL = 'https://polygonscan.com/'

export function blockExplorerLink(wallet: TokenInWallet): BlockExplorerLink {
  const addressUrl = 'address/' + wallet.address
  switch (wallet.network) {
    case 'Ethereum':
      return { name: 'Etherscan', link: ETHERSCAN_BASE_URL + addressUrl }
    case 'Polygon':
      return { name: 'Polygonscan', link: POLYGONSCAN_BASE_URL + addressUrl }
    default:
      logger.error('Unable to get block explorer link', { wallet })
      return { name: '', link: '/' }
  }
}

export function validateUniqueAddresses(addresses: string[]): boolean {
  const uniqueSet = new Set(addresses.map((address) => address.toLowerCase()))
  return uniqueSet.size === addresses.length
}
