import { useState } from 'react'

import { Header } from 'decentraland-ui/dist/components/Header/Header'

import useFormatMessage from '../../hooks/useFormatMessage'
import { AggregatedTokenBalance } from '../../types/transparency'
import { Dai, Eth, Mana, Matic, Usdc, Usdt, Weth } from '../Icon/Token'

import './TokenBalanceCard.css'
import TokensPerWalletPopup from './TokensPerWalletPopup'

export type TokenBalanceCardProps = React.HTMLAttributes<HTMLDivElement> & {
  aggregatedTokenBalance: AggregatedTokenBalance
}

function getIcon(tokenSymbol: string) {
  switch (tokenSymbol) {
    case 'mana':
      return <Mana />
    case 'dai':
      return <Dai />
    case 'eth':
      return <Eth />
    case 'matic':
      return <Matic />
    case 'usdc':
      return <Usdc />
    case 'usdt':
      return <Usdt />
    case 'weth':
      return <Weth />
    default:
      return null
  }
}

export default function TokenBalanceCard({ aggregatedTokenBalance }: TokenBalanceCardProps) {
  const t = useFormatMessage()
  const [openPopup, setOpenPopup] = useState(false)

  function handleClick() {
    setOpenPopup(!openPopup)
  }

  function handleClose() {
    setOpenPopup(false)
  }

  return (
    <div className="TokenBalanceCard" onClick={handleClick}>
      {getIcon(aggregatedTokenBalance.tokenTotal.symbol.toLowerCase())}
      <div className="TokenBalanceCard_description">
        <div className="TokenBalanceCard__Header">
          <Header sub className="TokenBalanceCard__Symbol">
            {aggregatedTokenBalance.tokenTotal.symbol + ' Tokens'}
          </Header>
          {aggregatedTokenBalance.tokenTotal.amount > 0 && (
            <TokensPerWalletPopup
              tokensPerWallet={aggregatedTokenBalance.tokenInWallets}
              open={openPopup}
              onClose={handleClose}
            />
          )}
        </div>
        <span>{t('general.number', { value: aggregatedTokenBalance.tokenTotal.amount })}</span>
      </div>
    </div>
  )
}
