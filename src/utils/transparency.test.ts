import { getGenericTokenLabel } from '../components/Icon/Token/Generic'
import { TokenInWallet } from '../types/transparency'

import { aggregateBalances, getDisplayedBalances } from './transparency'

// balances.json carries plain numbers even though the types say bigint
function balance(symbol: string, amount: number, quote: number, name = 'DAO Operational Multisig'): TokenInWallet {
  return {
    symbol,
    contractAddress: `0x${symbol}`,
    amount: amount as unknown as bigint,
    quote: quote as unknown as bigint,
    name,
    network: 'Ethereum',
    address: '0x89214c8ca9a49e60a3bfa8e00544f384c93719b1',
    timestamp: new Date('2026-10-21T00:00:00Z'),
    rate: amount ? quote / amount : 0,
  }
}

describe('aggregateBalances', () => {
  const balances = [
    balance('DAI', 87577.6, 87577.6),
    balance('cbBTC', 1.7555, 148535),
    balance('MANA', 1000000, 89078, 'Aragon Agent'),
    balance('MANA', 2000000, 178156, 'DAO Treasury Mandate Multisig'),
    balance('crvUSD', 0.0001, 0.0001),
  ]

  it('sorts tokens by USD value, not by token amount', () => {
    expect(aggregateBalances(balances).map((token) => token.tokenTotal.symbol)).toEqual([
      'MANA',
      'cbBTC',
      'DAI',
      'crvUSD',
    ])
  })

  it('adds up the amount and value of each token across wallets', () => {
    const mana = aggregateBalances(balances).find((token) => token.tokenTotal.symbol === 'MANA')
    expect(mana?.tokenTotal).toEqual({ symbol: 'MANA', amount: 3000000, quote: 267234 })
    expect(mana?.tokenInWallets.map((wallet) => wallet.name)).toEqual(['Aragon Agent', 'DAO Treasury Mandate Multisig'])
  })
})

describe('getDisplayedBalances', () => {
  it('leaves out tokens worth less than a dollar', () => {
    const aggregated = aggregateBalances([
      balance('MANA', 1000, 89),
      balance('crvUSD', 0.0001, 0.0001),
      balance('MATIC', 89.5, 11.3),
    ])
    expect(getDisplayedBalances(aggregated).map((token) => token.tokenTotal.symbol)).toEqual(['MANA', 'MATIC'])
  })
})

describe('getGenericTokenLabel', () => {
  it('shows short symbols whole', () => {
    expect(getGenericTokenLabel('safe')).toBe('SAFE')
  })

  it('shows the tracked asset of wrapped and vault tokens', () => {
    expect(getGenericTokenLabel('stETH')).toBe('ETH')
    expect(getGenericTokenLabel('cbBTC')).toBe('BTC')
    expect(getGenericTokenLabel('steakUSDC')).toBe('USDC')
  })

  it('falls back to the first letters', () => {
    expect(getGenericTokenLabel('mallycoin')).toBe('MAL')
  })
})
