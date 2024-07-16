import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Card } from 'decentraland-ui/dist/components/Card/Card'

import { Governance } from '../../../clients/Governance.ts'
import useFormatMessage from '../../../hooks/useFormatMessage.ts'
import { AccountType } from '../../../types/users.ts'
import Time from '../../../utils/date/Time.ts'
import CheckCircle from '../../Icon/CheckCircle.tsx'

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

  const handleUnlinkAccount = async (accountType: AccountType) => {
    try {
      await Governance.get().unlinkAccount(accountType)
      onUnlinkSuccessful()
    } catch (e) {
      console.error(e)
    }
  }

  return (
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
      <Button basic onClick={() => handleUnlinkAccount(account)} className="UnlinkAccountCard__Action">
        {t('modal.identity_setup.unlink_action')}
      </Button>
    </Card>
  )
}

export default UnlinkAccountCard
