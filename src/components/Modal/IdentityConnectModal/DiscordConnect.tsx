import useFormatMessage from '../../../hooks/useFormatMessage.ts'
import useIsProfileValidated from '../../../hooks/useIsProfileValidated.ts'
import { AccountType } from '../../../types/users.ts'
import ActionCard from '../../ActionCard/ActionCard'
import CircledDiscord from '../../Icon/CircledDiscord.tsx'

import './AccountConnection.css'
import { FlowType } from './AccountsConnectModal.tsx'
import DiscordConnectionFlow from './DiscordConnectionFlow.tsx'
import { FlowProps } from './ForumConnect.tsx'

function DiscordConnect({ onClose, address, setActiveFlow, activeFlow }: FlowProps) {
  const t = useFormatMessage()
  const { isProfileValidated } = useIsProfileValidated(address, [AccountType.Discord])
  const initializeDiscord = () => {
    setActiveFlow(FlowType.Discord)
  }

  const isDiscordFlowActive = activeFlow === FlowType.Discord

  return (
    <>
      {!isDiscordFlowActive ? (
        <ActionCard
          title={t('modal.identity_setup.discord.card_title')}
          description={t('modal.identity_setup.discord.card_description')}
          icon={<CircledDiscord />}
          onCardClick={initializeDiscord}
          isVerified={isProfileValidated}
        />
      ) : (
        <DiscordConnectionFlow address={address} onClose={onClose} />
      )}
    </>
  )
}

export default DiscordConnect
