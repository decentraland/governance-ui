import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { Close } from 'decentraland-ui/dist/components/Close/Close'
import { Modal } from 'decentraland-ui/dist/components/Modal/Modal'

import { useAuthContext } from '../../../context/AuthProvider'
import useFormatMessage from '../../../hooks/useFormatMessage'
import { AccountType } from '../../../types/users'

import DiscordConnect from './DiscordConnect.tsx'
import ForumConnect from './ForumConnect'
import PushConnect from './PushConnect.tsx'

export enum FlowType {
  Forum,
  Discord,
  Push,
}

type AccountsConnectModalProps = {
  open: boolean
  onClose: () => void
  account?: AccountType
}

function AccountsConnectModal({ open, onClose }: AccountsConnectModalProps) {
  const t = useFormatMessage()
  const [address] = useAuthContext()

  const [activeFlow, setActiveFlow] = useState<FlowType | null>(null)

  const queryClient = useQueryClient()

  const invalidateProfileQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ['isProfileValidated', address],
    })
    queryClient.invalidateQueries({
      queryKey: ['userGovernanceProfile', address],
    })
    queryClient.invalidateQueries({
      queryKey: ['isDiscordActive', address],
    })
  }

  const handleClose = () => {
    invalidateProfileQueries()
    setActiveFlow(null)
    onClose()
  }

  if (!address) return null

  return (
    <Modal open={open} size="tiny" onClose={handleClose} closeIcon={<Close />}>
      <Modal.Header className="AccountConnection__Header">
        <div>{t('modal.identity_setup.title')}</div>
      </Modal.Header>
      <Modal.Content>
        {(activeFlow === null || activeFlow === FlowType.Forum) && (
          <ForumConnect onClose={handleClose} address={address} activeFlow={activeFlow} setActiveFlow={setActiveFlow} />
        )}
        {(activeFlow === null || activeFlow === FlowType.Discord) && (
          <DiscordConnect
            onClose={handleClose}
            address={address}
            activeFlow={activeFlow}
            setActiveFlow={setActiveFlow}
          />
        )}
        {(activeFlow === null || activeFlow === FlowType.Push) && (
          <PushConnect onClose={handleClose} address={address} activeFlow={activeFlow} setActiveFlow={setActiveFlow} />
        )}
      </Modal.Content>
    </Modal>
  )
}

export default AccountsConnectModal
