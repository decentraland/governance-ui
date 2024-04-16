import { useAuthContext } from '../../context/AuthProvider'
import useFormatMessage from '../../hooks/useFormatMessage'
import { isSameAddress } from '../../utils/snapshot'
import { CoauthorAttributes } from '../../types/coauthors'

import { ProposalCreatedList } from './ProposalCreatedList'

interface Props {
  address?: string
  pendingCoauthorRequests?: CoauthorAttributes[]
}

const CoAuthoringTab = ({ address, pendingCoauthorRequests }: Props) => {
  const [account] = useAuthContext()
  const t = useFormatMessage()

  const isLoggedUserProfile = isSameAddress(account, address || '')
  const user = isLoggedUserProfile ? account : address

  return (
    <ProposalCreatedList
      proposalsFilter={{
        load: !!user,
        ...(!!user && { user: user?.toLowerCase() }),
        coauthor: true,
      }}
      emptyDescriptionText={
        isLoggedUserProfile
          ? t('page.profile.activity.coauthoring.empty_logged_user')
          : t('page.profile.activity.coauthoring.empty')
      }
      showCoauthoring
      pendingCoauthorRequests={pendingCoauthorRequests}
    />
  )
}

export default CoAuthoringTab
