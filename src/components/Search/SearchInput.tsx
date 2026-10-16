import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import classNames from 'classnames'
import { Close } from 'decentraland-ui/dist/components/Close/Close'

import useFormatMessage from '../../hooks/useFormatMessage'
import { useProposalsSearchParams } from '../../hooks/useProposalsSearchParams'
import locations, { isProposalsListPath } from '../../utils/locations'

import './SearchInput.css'

export default function SearchInput() {
  const t = useFormatMessage()
  const navigate = useNavigate()
  const location = useLocation()
  const { search } = useProposalsSearchParams()
  const searchInput = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [searchText, setSearchText] = useState(() => search || '')

  function handleSearch(textSearch: string) {
    // only keep the current filters when already on the proposals list: on other pages (projects,
    // a proposal) the params belong to that page and would leak into the proposals filters
    const newParams = new URLSearchParams(isProposalsListPath(location.pathname) ? location.search : '')
    if (textSearch) {
      newParams.set('search', textSearch)
      newParams.delete('page')
      newParams.delete('order')
    } else {
      newParams.delete('search')
      newParams.delete('page')
    }

    navigate(locations.proposals(newParams))
  }

  function focusSearch() {
    searchInput.current?.focus()
  }

  useEffect(() => {
    if (!search) {
      setSearchText('')
      setOpen(false)
    } else {
      // follow the url, e.g. when going back to a previous search
      setSearchText(search)
      focusSearch()
    }
  }, [search])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value)
  }

  function handleClear() {
    setSearchText('')
    focusSearch()
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearch(searchText)
    }
  }

  const keyUpHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Escape') {
      setSearchText('')
    }
  }

  // TODO: onKeyPress deprecated. Remove

  return (
    <div className="SearchContainer">
      <input
        className={classNames('SearchInput', open && 'SearchInput--open')}
        value={searchText}
        placeholder={t('navigation.search.placeholder') || ''}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        onKeyUp={keyUpHandler}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(!!searchText)}
        ref={searchInput}
      />
      {searchText && open && <Close small onClick={handleClear} />}
    </div>
  )
}
