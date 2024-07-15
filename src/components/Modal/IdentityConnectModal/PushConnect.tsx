import { useState } from 'react'

import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { Web3Provider } from '@ethersproject/providers'

import { PUSH_CHANNEL_ID } from '../../../constants'
import { useAuthContext } from '../../../context/AuthProvider.tsx'
import useFormatMessage from '../../../hooks/useFormatMessage.ts'
import usePushSubscriptions from '../../../hooks/usePushSubscriptions.ts'
import { getCaipAddress, getPushNotificationsEnv } from '../../../utils/notifications.ts'
import ActionCard from '../../ActionCard/ActionCard'
import CircledPush from '../../Icon/CircledPush.tsx'

import './AccountConnection.css'
import { FlowType } from './AccountsConnectModal.tsx'
import { FlowProps } from './ForumConnect.tsx'
import PushConnectionFlow from './PushConnectionFlow.tsx'

export type PushState = 'subscribing' | 'success' | 'error' | null

function PushConnect({ onClose, address, setActiveFlow, activeFlow }: FlowProps) {
  const [user, userState] = useAuthContext()
  const isPushFlowActive = activeFlow === FlowType.Push
  const { isSubscribedToDaoChannel } = usePushSubscriptions()
  const chainId = userState.chainId || ChainId.ETHEREUM_SEPOLIA
  const env = getPushNotificationsEnv(chainId)
  const [pushState, setPushState] = useState<PushState>(null)
  const t = useFormatMessage()

  const initializePush = async () => {
    setActiveFlow(FlowType.Push)
    if (!user || !userState.provider) {
      return
    }

    setPushState('subscribing')

    const signer = new Web3Provider(userState.provider).getSigner()
    const PushAPI = await import('@pushprotocol/restapi')
    await PushAPI.channels.subscribe({
      signer,
      channelAddress: getCaipAddress(PUSH_CHANNEL_ID, chainId),
      userAddress: getCaipAddress(user, chainId),
      onSuccess: () => setPushState('success'),
      onError: () => setPushState('error'),
      env,
    })
  }

  return (
    <>
      {!isPushFlowActive ? (
        <ActionCard
          title={t('modal.identity_setup.push.card_title')}
          description={t('modal.identity_setup.push.card_description')}
          icon={<CircledPush />}
          onCardClick={initializePush}
          helper={t('modal.identity_setup.push.helper')}
          isVerified={isSubscribedToDaoChannel}
        />
      ) : (
        <PushConnectionFlow address={address} onClose={onClose} pushState={pushState} initializePush={initializePush} />
      )}
    </>
  )
}

export default PushConnect
