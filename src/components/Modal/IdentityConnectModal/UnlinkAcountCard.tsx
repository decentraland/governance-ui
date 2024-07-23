import { useState } from 'react'

import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Card } from 'decentraland-ui/dist/components/Card/Card'

import { Governance } from '../../../clients/Governance.ts'
import useFormatMessage from '../../../hooks/useFormatMessage.ts'
import { AccountType } from '../../../types/users.ts'
import Time from '../../../utils/date/Time.ts'
import CheckCircle from '../../Icon/CheckCircle.tsx'
import ConfirmationModal from '../ConfirmationModal.tsx'

import './UnlinkAcountCard.css'

function UnlinkAccountCard({
  account,
  accountUsername,
  verificationDate,
  onUnlinkSuccessful,
}: {
  account: AccountType
  accountUsername?: string | null
  verificationDate?: string
  onUnlinkSuccessful: () => void
}) {
  const t = useFormatMessage()
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)

  const handleUnlinkAccount = async (accountType: AccountType) => {
    try {
      await Governance.get().unlinkAccount(accountType)
      onUnlinkSuccessful()
    } catch (e) {
      console.error(e)
    }
  }

  const handleUnlinkConfirmation = async () => {
    await handleUnlinkAccount(account)
    setIsConfirmationModalOpen(false)
  }

  return (
    <div>
      <Card className="UnlinkAccountCard">
        <div className="UnlinkAccountCard__AccountData">
          <div className="UnlinkAccountCard__Title">
            {account}
            <CheckCircle size="16" />
          </div>
          <div className="UnlinkAccountCard__AccountDetails">
            {t('modal.identity_setup.unlink_account_details', {
              username: accountUsername || null,
              date: Time(verificationDate).fromNow(),
            })}
          </div>
        </div>
        <Button basic onClick={() => setIsConfirmationModalOpen(true)} className="UnlinkAccountCard__Action">
          {t('modal.identity_setup.unlink_action')}
        </Button>
      </Card>
      <ConfirmationModal
        isLoading={false}
        isOpen={isConfirmationModalOpen}
        onPrimaryClick={handleUnlinkConfirmation}
        onSecondaryClick={() => setIsConfirmationModalOpen(false)}
        onClose={() => setIsConfirmationModalOpen(false)}
        title={t('modal.identity_setup.unlink_confirmation_modal.title')}
        description={t('modal.identity_setup.unlink_confirmation_modal.description')}
        primaryButtonText={t('modal.identity_setup.unlink_confirmation_modal.unlink_action')}
        secondaryButtonText={t('modal.delete_item.reject')}
      />
    </div>
  )
}

export default UnlinkAccountCard
