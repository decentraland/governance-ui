import NotFound from '../../components/Layout/NotFound'
import ProposalSubmitCatalystPage from '../../components/Proposal/Submit/ProposalSubmitCatalystPage'
import useURLSearchParams from '../../hooks/useURLSearchParams'
import { toCatalystType } from '../../utils/proposal'

import './submit.css'

export default function CatalystPage() {
  const params = useURLSearchParams()
  const request = params.get('request')

  const catalystType = toCatalystType(request, () => null)

  if (catalystType !== null) {
    return <ProposalSubmitCatalystPage catalystType={catalystType} />
  }

  return <NotFound />
}
