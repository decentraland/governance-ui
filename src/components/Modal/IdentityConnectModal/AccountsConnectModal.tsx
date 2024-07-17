import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { Close } from 'decentraland-ui/dist/components/Close/Close'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import { Modal } from 'decentraland-ui/dist/components/Modal/Modal'

import { useAuthContext } from '../../../context/AuthProvider'
import useFormatMessage from '../../../hooks/useFormatMessage'
import useGovernanceProfile from '../../../hooks/useGovernanceProfile.ts'
import { AccountType } from '../../../types/users'

import DiscordConnect from './DiscordConnect.tsx'
import ForumConnect from './ForumConnect'
import PushConnect from './PushConnect.tsx'
import UnlinkAccountCard from './UnlinkAcountCard.tsx'

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

  const { profile, isLoadingGovernanceProfile } = useGovernanceProfile(address)
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
    queryClient.invalidateQueries({
      queryKey: ['pushSubscriptions', address],
    })
  }

  const handleClose = () => {
    invalidateProfileQueries()
    setActiveFlow(null)
    onClose()
  }

  if (!address) return null

  const hasLinkedForumAccount = !!profile?.forum_id && !!profile.forum_verification_date
  const hasLinkedDiscordAccount = !!profile?.discord_verification_date
  const showForumConnect = (activeFlow === null || activeFlow === FlowType.Forum) && !hasLinkedForumAccount
  const showDiscordConnect = (activeFlow === null || activeFlow === FlowType.Discord) && !hasLinkedDiscordAccount
  const showPushConnect = activeFlow === null || activeFlow === FlowType.Push

  return (
    <Modal open={open} size="tiny" onClose={handleClose} closeIcon={<Close />}>
      <Modal.Header className="AccountConnection__Header">
        <div>{t('modal.identity_setup.title')}</div>
      </Modal.Header>
      <Modal.Content>
        {!isLoadingGovernanceProfile && (
          <>
            {activeFlow === null && (
              <>
                {hasLinkedForumAccount && (
                  <UnlinkAccountCard
                    account={AccountType.Forum}
                    accountUsername={profile.forum_username}
                    verificationDate={profile.forum_verification_date}
                    onUnlinkSuccessful={handleClose}
                  />
                )}
                {hasLinkedDiscordAccount && (
                  <UnlinkAccountCard
                    account={AccountType.Discord}
                    verificationDate={profile.discord_verification_date}
                    onUnlinkSuccessful={handleClose}
                  />
                )}
              </>
            )}
            {showForumConnect && (
              <ForumConnect
                onClose={handleClose}
                address={address}
                active={activeFlow === FlowType.Forum}
                initialize={() => {
                  setActiveFlow(FlowType.Forum)
                }}
              />
            )}
            {showDiscordConnect && (
              <DiscordConnect
                onClose={handleClose}
                address={address}
                active={activeFlow === FlowType.Discord}
                initialize={() => {
                  setActiveFlow(FlowType.Discord)
                }}
              />
            )}
            {showPushConnect && (
              <PushConnect
                onClose={handleClose}
                address={address}
                active={activeFlow === FlowType.Push}
                initialize={() => {
                  setActiveFlow(FlowType.Push)
                }}
              />
            )}
          </>
        )}
        {isLoadingGovernanceProfile && <Loader />}
      </Modal.Content>
    </Modal>
  )
}

export default AccountsConnectModal
