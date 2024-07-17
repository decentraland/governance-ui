import useFormatMessage from '../../../hooks/useFormatMessage.ts'
import ActionCard from '../../ActionCard/ActionCard'
import CircledDiscord from '../../Icon/CircledDiscord.tsx'

import './AccountConnection.css'
import DiscordConnectionFlow from './DiscordConnectionFlow.tsx'
import { ConnectProps } from './ForumConnect.tsx'

function DiscordConnect({ onClose, address, active, initialize }: ConnectProps) {
  const t = useFormatMessage()

  return (
    <>
      {!active ? (
        <ActionCard
          title={t('modal.identity_setup.discord.card_title')}
          description={t('modal.identity_setup.discord.card_description')}
          icon={<CircledDiscord />}
          onCardClick={initialize}
          isVerified={false}
        />
      ) : (
        <DiscordConnectionFlow address={address} onClose={onClose} />
      )}
    </>
  )
}

export default DiscordConnect
