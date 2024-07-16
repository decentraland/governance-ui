import useFormatMessage from '../../../hooks/useFormatMessage.ts'
import ActionCard from '../../ActionCard/ActionCard.tsx'
import CircledForum from '../../Icon/CircledForum.tsx'

import ForumConnectionFlow from './ForumConnectionFlow.tsx'

export interface ConnectProps {
  onClose: () => void
  address: string
  active: boolean
  initialize: () => void
}

function ForumConnect({ onClose, address, initialize, active }: ConnectProps) {
  const t = useFormatMessage()

  return (
    <>
      {!active ? (
        <ActionCard
          title={t('modal.identity_setup.forum.card_title')}
          description={t('modal.identity_setup.forum.card_description')}
          icon={<CircledForum />}
          onCardClick={initialize}
          isVerified={false}
        />
      ) : (
        <ForumConnectionFlow address={address} onClose={onClose} />
      )}
    </>
  )
}

export default ForumConnect
