import { useCallback, useEffect, useRef } from 'react'

import { Governance } from '../clients/Governance'
import { DISCORD_PROFILE_VERIFICATION_URL } from '../constants/users'
import { openUrl } from '../helpers'
import { SegmentEvent } from '../types/events'
import { AccountType } from '../types/users'
import { startValidationPoller } from '../utils/validationPoller'

import useAnalyticsTrack from './useAnalyticsTrack'
import useValidationSetup, { VALIDATION_CHECK_INTERVAL } from './useValidationSetup'

function useDiscordConnect() {
  const {
    user,
    resetTimer,
    getSignedMessage,
    copyMessageToClipboard,
    time,
    validatingProfile,
    setValidatingProfile,
    isValidated,
    setIsValidated,
    resetValidation,
  } = useValidationSetup(AccountType.Discord)

  const track = useAnalyticsTrack()
  const isStartingPoller = useRef(false)

  useEffect(() => {
    isStartingPoller.current = false
  }, [validatingProfile])

  const openChannel = useCallback(() => {
    openUrl(DISCORD_PROFILE_VERIFICATION_URL)
    if (validatingProfile === undefined && !isStartingPoller.current) {
      isStartingPoller.current = true
      setValidatingProfile(
        startValidationPoller({
          intervalMs: VALIDATION_CHECK_INTERVAL,
          check: () => Governance.get().validateDiscordProfile(),
          onValid: () => {
            resetTimer()
            setIsValidated(true)
            track(SegmentEvent.IdentityCompleted, { address: user, account: AccountType.Discord })
          },
          onError: () => setIsValidated(false),
        })
      )
    }
  }, [resetTimer, setIsValidated, setValidatingProfile, track, user, validatingProfile])

  return {
    getSignedMessage,
    copyMessageToClipboard,
    openChannel,
    time,
    isValidated,
    reset: resetValidation,
  }
}

export default useDiscordConnect
