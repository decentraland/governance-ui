import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'
import { Close } from 'decentraland-ui/dist/components/Close/Close'

import useFormatMessage from '../../hooks/useFormatMessage'
import { useProposalsSearchParams } from '../../hooks/useProposalsSearchParams'
import locations from '../../utils/locations'

import './SearchInput.css'

export default function SearchInput() {
  const t = useFormatMessage()
  const navigate = useNavigate()
  const { search } = useProposalsSearchParams()
  const searchInput = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [searchText, setSearchText] = useState(() => search || '')

  function handleSearch(textSearch: string, location: Location) {
    const newParams = new URLSearchParams(location.search)
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
      handleSearch(searchText, location)
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
