import NotFound from '../../components/Layout/NotFound'
import ProposalSubmitPoiPage from '../../components/Proposal/Submit/ProposalSubmitPoiPage'
import useURLSearchParams from '../../hooks/useURLSearchParams'
import { toPoiType } from '../../utils/proposal'

import './submit.css'

export default function Poi() {
  const params = useURLSearchParams()
  const request = params.get('request')

  const poiType = toPoiType(request, () => null)

  if (poiType !== null) {
    return <ProposalSubmitPoiPage poiType={poiType} />
  }

  return <NotFound />
}
