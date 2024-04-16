import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'
import { Dropdown } from 'decentraland-ui/dist/components/Dropdown/Dropdown'
import { useMobileMediaQuery } from 'decentraland-ui/dist/components/Media/Media'

import { getUrlFilters } from '../../helpers'
import useFormatMessage from '../../hooks/useFormatMessage'
import useURLSearchParams from '../../hooks/useURLSearchParams'
import { SortingOrder } from '../../types/proposals'
import { toSortingOrder } from '../../utils/proposal'

import './SortingMenu.css'

const SORT_KEY = 'order'

export default function SortingMenu() {
  const navigate = useNavigate()
  const params = useURLSearchParams()
  const isSearching = !!params.get('search')
  const order = toSortingOrder(params.get('order'), () => (isSearching ? 'RELEVANCE' : SortingOrder.DESC))
  const arrowDirection = order === SortingOrder.ASC ? 'Upwards' : 'Downwards'
  const isMobile = useMobileMediaQuery()

  const t = useFormatMessage()

  return (
    <Dropdown
      className={classNames('SortingMenu', arrowDirection)}
      direction={isMobile ? 'left' : 'right'}
      text={t(`navigation.search.sorting.${order}`) || ''}
    >
      <Dropdown.Menu>
        {isSearching && (
          <Dropdown.Item
            text={t('navigation.search.sorting.RELEVANCE')}
            onClick={() => navigate(getUrlFilters(SORT_KEY, params, undefined))}
          />
        )}
        <Dropdown.Item
          text={t('navigation.search.sorting.DESC')}
          onClick={() => navigate(getUrlFilters(SORT_KEY, params, SortingOrder.DESC))}
        />
        <Dropdown.Item
          text={t('navigation.search.sorting.ASC')}
          onClick={() => navigate(getUrlFilters(SORT_KEY, params, SortingOrder.ASC))}
        />
      </Dropdown.Menu>
    </Dropdown>
  )
}
