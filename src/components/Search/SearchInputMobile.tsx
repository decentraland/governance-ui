import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import classNames from 'classnames'

import useFormatMessage from '../../hooks/useFormatMessage'
import { useProposalsSearchParams } from '../../hooks/useProposalsSearchParams'
import locations from '../../utils/locations'
import Cross from '../Icon/Cross'

import './SearchInputMobile.css'

export default function SearchInputMobile() {
  const t = useFormatMessage()
  const navigate = useNavigate()
  const location = useLocation()
  const { search } = useProposalsSearchParams()
  const searchInput = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [searchText, setSearchText] = useState(search || '')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = (textSearch: string, location: any) => {
    const newParams = new URLSearchParams(location.search)
    if (textSearch) {
      newParams.set('search', textSearch)
      newParams.delete('page')
      newParams.delete('order')
    } else {
      newParams.delete('search')
      newParams.delete('page')
    }

    handleClose()
    searchInput.current?.blur()
    navigate(locations.proposals(newParams))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const handleClear = () => {
    if (searchText === '') {
      handleClose()
    } else {
      setSearchText('')
      searchInput.current?.focus()
      searchInput.current?.click()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchText, location)
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Escape') {
      setSearchText('')
    }
  }

  const handleClose = useCallback(() => {
    searchInput.current?.blur()
    setOpen(false)
  }, [])

  const lastScroll = useRef(0)
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const onScroll = () => {
        const isScrollDown = window.scrollY > lastScroll.current
        lastScroll.current = window.scrollY
        if (isScrollDown) {
          handleClose()
        }
      }

      window.addEventListener('scroll', onScroll)

      return () => window.removeEventListener('scroll', onScroll)
    }
  }, [handleClose])

  return (
    <>
      <div
        className={classNames('SearchInputMobile__Overlay', open && 'SearchInputMobile__Overlay--open')}
        onClick={handleClose}
      />
      <div className={classNames('SearchInputMobile', open && 'SearchInputMobile--open')}>
        <div className="SearchInputMobile__Container">
          {!open && <div className="SearchInputMobile__Gradient" />}
          <input
            ref={searchInput}
            className={classNames('SearchInputMobile__Input', open && 'SearchInputMobile__Input--open')}
            value={searchText}
            placeholder={t('navigation.search.placeholder') || ''}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            onKeyUp={handleKeyUp}
            onFocus={() => setOpen(true)}
          />
          {open && (
            <button className="SearchInputMobile__CloseButton" onClick={handleClear}>
              <Cross className="SearchInputMobile__CloseIcon" size={14} color="var(--black-800)" />
            </button>
          )}
        </div>
      </div>
    </>
  )
}
