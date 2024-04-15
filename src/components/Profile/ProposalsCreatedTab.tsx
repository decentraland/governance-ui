import { useAuthContext } from '../../context/AuthProvider'
import useFormatMessage from '../../hooks/useFormatMessage'
import { isSameAddress } from '../../utils/snapshot'

import { ProposalCreatedList } from './ProposalCreatedList'

interface Props {
  address?: string
}

const ProposalsCreatedTab = ({ address }: Props) => {
  const [account] = useAuthContext()
  const t = useFormatMessage()

  const isLoggedUserAddress = isSameAddress(account, address || '')
  const user = isLoggedUserAddress ? account : address

  const emptyDescriptionKey = isLoggedUserAddress
    ? 'page.profile.activity.my_proposals.empty'
    : 'page.profile.created_proposals.empty'

  return (
    <ProposalCreatedList
      proposalsFilter={{
        load: !!user,
        ...(!!user && { user: user?.toLowerCase() }),
      }}
      emptyDescriptionText={t(emptyDescriptionKey)}
    />
  )
}

export default ProposalsCreatedTab
