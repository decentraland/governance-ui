import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Card } from 'decentraland-ui/dist/components/Card/Card'

import useFormatMessage from '../../../hooks/useFormatMessage.ts'
import { AccountType } from '../../../types/users.ts'
import Time from '../../../utils/date/Time.ts'
import CheckCircle from '../../Icon/CheckCircle.tsx'

import './UnlinkAcountCard.css'

function UnlinkAccountCard({
  account,
  accountUsername,
  verificationDate,
}: {
  account: AccountType
  accountUsername?: string | null
  verificationDate?: string
}) {
  const t = useFormatMessage()

  const unlinkAccount = (account: AccountType) => {
    console.log('unlink account', account)
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
            username: accountUsername,
            date: Time(verificationDate).fromNow(),
          })}
        </div>
      </div>
      <Button basic onClick={() => unlinkAccount(account)} className="UnlinkAccountCard__Action">
        {t('modal.identity_setup.unlink_action')}
      </Button>
    </Card>
  )
}

export default UnlinkAccountCard
