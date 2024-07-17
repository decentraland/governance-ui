import { useNavigate } from 'react-router-dom'

import { AccountType } from '../../../types/users.ts'
import locations from '../../../utils/locations.ts'
import UnsubscribedView from '../../Notifications/NotificationsFeedView/UnsubscribedView.tsx'

import PostConnection from './PostConnection.tsx'
import { PushState } from './PushConnect.tsx'

type Props = { address: string; onClose: () => void; pushState: PushState; initializePush: () => void }

function PushConnectionFlow({ address, onClose, pushState, initializePush }: Props) {
  const account = AccountType.Push
  const navigate = useNavigate()

  const handlePostAction = () => {
    navigate(locations.profile({ address: address || '' }))
    onClose()
  }

  return (
    <>
      {pushState !== 'success' && (
        <div className="AccountsConnectModal__PushState">
          <UnsubscribedView subscriptionState={pushState} onErrorClick={initializePush} />
        </div>
      )}
      {pushState === 'success' && (
        <PostConnection
          account={account}
          onPostAction={handlePostAction}
          isValidated={true}
          address={address || undefined}
        />
      )}
    </>
  )
}

export default PushConnectionFlow
