import { validateQuarter, validateYear } from '../helpers'

import useURLSearchParams from './useURLSearchParams'

function useYearAndQuarterParams() {
  const params = useURLSearchParams()
  const yearParam = params.year
  const quarterParam = params.quarter
  const year = validateYear(yearParam)
  const quarter = validateQuarter(quarterParam)
  const areValidParams = year !== null && quarter !== null

  return {
    year,
    quarter,
    areValidParams,
  }
}

export default useYearAndQuarterParams
