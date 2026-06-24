import { Card } from 'decentraland-ui/dist/components/Card/Card'
import { Header } from 'decentraland-ui/dist/components/Header/Header'
import { Popup } from 'decentraland-ui/dist/components/Popup/Popup'

import { COMMITTEE_DEPRECATION_PROPOSAL_ID } from '../../constants'
import useFormatMessage from '../../hooks/useFormatMessage'
import { TokenInWallet, WalletStatus } from '../../types/transparency'
import locations from '../../utils/locations'
import { blockExplorerLink } from '../../utils/transparency'
import Link from '../Common/Typography/Link'
import Text from '../Common/Typography/Text'
import Info from '../Icon/Info'
import WarningTriangle from '../Icon/WarningTriangle'

import './TokensPerWalletPopup.css'

interface Props {
  tokensPerWallet: TokenInWallet[]
  open: boolean
  onClose: (e: React.MouseEvent<unknown>) => void
}

export default function TokensPerWalletPopup({ tokensPerWallet, open, onClose }: Props) {
  const t = useFormatMessage()

  const content = (
    <Card className={'TokensPerWalletPopup__Card'}>
      <Card.Content className="TokensPerWalletPopup__Content">
        {tokensPerWallet.map((tokenInWallet, index) => {
          if (tokenInWallet.amount == BigInt(0)) return

          const explorerLink = blockExplorerLink(tokenInWallet)
          const isDisputed = tokenInWallet.status === WalletStatus.Disputed
          return (
            <div className="TokensPerWalletPopup__Item" key={[tokenInWallet.name, '_popup', index].join('::')}>
              <Link className="TokensPerWalletPopup__Row" href={explorerLink.link}>
                <div className="TokensPerWalletPopup__Block">
                  <div className="TokensPerWalletPopup__WalletName">
                    {isDisputed && <WarningTriangle className="TokensPerWalletPopup__WarningIcon" />}
                    <Header>{tokenInWallet.name}</Header>
                  </div>
                  <Header sub>{tokenInWallet.network} Network</Header>
                </div>
                <div className="TokensPerWalletPopup__Block TokensPerWalletPopup__RightBlock">
                  <div className={'TokensPerWalletPopup__Balance'}>
                    <Header>{t('general.number', { value: tokenInWallet.amount })}</Header>
                    <Text className="TokensPerWalletPopup__Symbol">{tokenInWallet.symbol}</Text>
                  </div>
                  <Header sub className="TokensPerWalletPopup__Link">
                    {t('page.transparency.mission.audit', { service_name: explorerLink.name })}
                  </Header>
                </div>
              </Link>
              {isDisputed && (
                <div className="TokensPerWalletPopup__Warning">
                  <Text className="TokensPerWalletPopup__WarningText">
                    {t('page.transparency.mission.disputed_wallet_warning')}{' '}
                    <Link href={locations.proposal(COMMITTEE_DEPRECATION_PROPOSAL_ID)}>
                      {t('page.transparency.mission.disputed_wallet_learn_more')}
                    </Link>
                  </Text>
                </div>
              )}
            </div>
          )
        })}
      </Card.Content>
    </Card>
  )

  return (
    <Popup
      className="TokensPerWalletPopup"
      content={content}
      position="bottom center"
      trigger={<Info size="14" />}
      eventsEnabled
      onClose={onClose}
      open={open}
      on="click"
      pinned={false}
    />
  )
}
