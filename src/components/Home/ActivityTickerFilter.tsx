import { useEffect, useState } from 'react'

import classNames from 'classnames'
import { Button } from 'decentraland-ui/dist/components/Button/Button'

import { useClickOutside } from '../../hooks/useClickOutside'
import useFormatMessage from '../../hooks/useFormatMessage'
import Counter from '../Common/Counter'
import Sort from '../Icon/Sort'

import './ActivityTickerFilter.css'
import ActivityTickerFilterItem from './ActivityTickerFilterItem'

export type TickerFilter = {
  proposals_created: boolean
  proposals_finished: boolean
  vestings_created: boolean
  votes: boolean
  delegation: boolean
  comments: boolean
  project_updates: boolean
}

export const INITIAL_TICKER_FILTER_STATE: TickerFilter = {
  proposals_created: false,
  proposals_finished: false,
  vestings_created: false,
  votes: false,
  delegation: false,
  comments: false,
  project_updates: false,
}

function countTrueProperties(obj: Record<string, boolean>): number {
  let count = 0
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      if (obj[key]) {
        count++
      }
    }
  }
  return count
}

interface Props {
  onApply: (filters: TickerFilter) => void
  filterState: TickerFilter
}

export default function ActivityTickerFilter({ onApply, filterState }: Props) {
  const t = useFormatMessage()
  const [isOpen, setIsOpen] = useState(false)
  const [checkedFilters, setCheckedFilters] = useState<TickerFilter>(filterState)
  const selectedFiltersCount = countTrueProperties(filterState)

  const handleApply = () => {
    onApply(checkedFilters)
    setIsOpen(false)
  }

  const handleClear = () => {
    setCheckedFilters(INITIAL_TICKER_FILTER_STATE)
  }

  useEffect(() => {
    setCheckedFilters(filterState)
  }, [filterState, isOpen])

  const handleEventTypeClick = (filterClicked: keyof TickerFilter) => {
    setCheckedFilters((prev) => ({ ...prev, [filterClicked]: !prev[filterClicked] }))
  }

  useClickOutside('.ActivityTickerFilter', isOpen, () => setIsOpen(false))

  return (
    <div className="ActivityTickerFilter">
      <div
        role="button"
        className="ActivityTickerFilter__ButtonContainer"
        onClick={() => setIsOpen((prevState) => !prevState)}
      >
        {selectedFiltersCount !== 0 && <Counter count={selectedFiltersCount} size="small" />}
        <div
          className={classNames(
            'ActivityTickerFilter__LabeledArrow',
            isOpen && `ActivityTickerFilter__LabeledArrow--open`
          )}
        >
          <span className="ActivityTickerFilter__Label">{t('page.home.activity_ticker.filter.label')}</span>
          <Sort descending={!isOpen} selectedColor="primary" />
        </div>
      </div>
      {isOpen && (
        <div className="ActivityTickerFilterBox">
          <div className="ActivityTickerFilterItems">
            {Object.keys(checkedFilters).map((key) => (
              <ActivityTickerFilterItem
                key={key}
                onClick={() => handleEventTypeClick(key as keyof TickerFilter)}
                checked={checkedFilters[key as keyof TickerFilter]}
                label={t(`page.home.activity_ticker.filter.${key}`)}
              />
            ))}
          </div>
          <div className={'ActivityTickerFilterBox__Buttons'}>
            <Button basic size={'small'} onClick={handleClear}>
              {t('page.home.activity_ticker.filter.clear')}
            </Button>
            <Button primary size={'small'} onClick={handleApply}>
              {t('page.home.activity_ticker.filter.apply')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
