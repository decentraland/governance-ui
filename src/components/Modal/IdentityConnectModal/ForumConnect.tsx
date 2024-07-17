import React from 'react'

import useFormatMessage from '../../../hooks/useFormatMessage.ts'
import useIsProfileValidated from '../../../hooks/useIsProfileValidated.ts'
import { AccountType } from '../../../types/users.ts'
import ActionCard from '../../ActionCard/ActionCard.tsx'
import CircledForum from '../../Icon/CircledForum.tsx'

import { FlowType } from './AccountsConnectModal.tsx'
import ForumConnectionFlow from './ForumConnectionFlow.tsx'

export interface FlowProps {
  onClose: () => void
  address: string
  activeFlow: null | FlowType
  setActiveFlow: React.Dispatch<React.SetStateAction<FlowType | null>>
}

function ForumConnect({ onClose, address, setActiveFlow, activeFlow }: FlowProps) {
  const t = useFormatMessage()
  const { isProfileValidated } = useIsProfileValidated(address, [AccountType.Forum])

  const initializeForum = () => {
    setActiveFlow(FlowType.Forum)
  }

  const isForumFlowActive = activeFlow === FlowType.Forum

  return (
    <>
      {!isForumFlowActive ? (
        <ActionCard
          title={t('modal.identity_setup.forum.card_title')}
          description={t('modal.identity_setup.forum.card_description')}
          icon={<CircledForum />}
          onCardClick={initializeForum}
          isVerified={isProfileValidated}
        />
      ) : (
        <ForumConnectionFlow address={address} onClose={onClose} />
      )}
    </>
  )
}

export default ForumConnect
