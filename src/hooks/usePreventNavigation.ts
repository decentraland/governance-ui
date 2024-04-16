import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import useFormatMessage from './useFormatMessage'

function usePreventNavigation(shouldPrevent: boolean, navigateTo = '/submit') {
  const confirmBack = useRef(false)
  const t = useFormatMessage()
  const navigate = useNavigate()

  useEffect(() => {
    const preventNavigation = (event?: BeforeUnloadEvent) => {
      if (event) {
        event.preventDefault()
        event.returnValue = ''
      } else if (!window.confirm(t('navigation.exit'))) {
        navigate(navigateTo)
      } else {
        confirmBack.current = true
        navigate(navigateTo)
      }
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldPrevent) {
        preventNavigation(event)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // const globalHistory = {} // todo: globalHistory was imported from reach/router
    // const unsubscribe = globalHistory.listen(({ action }) => {
    //   const pathname = toGovernancePathname(navigateTo)

    //   if (
    //     shouldPrevent &&
    //     (action === 'POP' || (action === 'PUSH' && pathname === locations.proposals() && !confirmBack.current))
    //   ) {
    //     preventNavigation()
    //   }
    // })

    const unsubscribe = () => {}

    return () => {
      unsubscribe()
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPrevent])
}

export default usePreventNavigation
