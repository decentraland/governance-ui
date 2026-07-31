import { useCallback, useEffect, useRef } from 'react'

import { Governance } from '../clients/Governance'
import { DISCOURSE_API } from '../constants'
import { DISCOURSE_CONNECT_THREAD } from '../constants/users'
import { openUrl } from '../helpers'
import { SegmentEvent } from '../types/events'
import { AccountType } from '../types/users'
import { startValidationPoller } from '../utils/validationPoller'

import useAnalyticsTrack from './useAnalyticsTrack'
import useValidationSetup, { VALIDATION_CHECK_INTERVAL } from './useValidationSetup'

export const THREAD_URL = `${DISCOURSE_API}${DISCOURSE_API.endsWith('/') ? '' : '/'}t/${DISCOURSE_CONNECT_THREAD}/10000`

export default function useForumConnect() {
  const {
    user,
    getSignedMessage,
    copyMessageToClipboard,
    resetTimer,
    time,
    validatingProfile,
    setValidatingProfile,
    isValidated,
    setIsValidated,
    resetValidation,
  } = useValidationSetup(AccountType.Forum)

  const track = useAnalyticsTrack()
  const isStartingPoller = useRef(false)

  useEffect(() => {
    isStartingPoller.current = false
  }, [validatingProfile])

  const openThread = useCallback(() => {
    openUrl(THREAD_URL)
    if (validatingProfile === undefined && !isStartingPoller.current) {
      isStartingPoller.current = true
      setValidatingProfile(
        startValidationPoller({
          intervalMs: VALIDATION_CHECK_INTERVAL,
          check: () => Governance.get().validateForumProfile(),
          onValid: () => {
            resetTimer()
            setIsValidated(true)
            track(SegmentEvent.IdentityCompleted, { address: user, account: AccountType.Forum })
          },
          onError: () => setIsValidated(false),
        })
      )
    }
  }, [resetTimer, setIsValidated, setValidatingProfile, track, user, validatingProfile])

  return {
    getSignedMessage,
    copyMessageToClipboard,
    openThread,
    time,
    isValidated,
    reset: resetValidation,
  }
}
