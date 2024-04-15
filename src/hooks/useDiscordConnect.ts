import { useCallback } from 'react'

import { Governance } from '../clients/Governance'
import { DISCORD_PROFILE_VERIFICATION_URL } from '../constants/users'
import { openUrl } from '../helpers'
import { SegmentEvent } from '../types/events'
import { AccountType } from '../types/users'

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

  const openChannel = useCallback(() => {
    openUrl(DISCORD_PROFILE_VERIFICATION_URL)
    if (validatingProfile === undefined) {
      const validationChecker = setInterval(async () => {
        try {
          const { valid } = await Governance.get().validateDiscordProfile()
          if (valid) {
            clearInterval(validationChecker)
            resetTimer()
            setIsValidated(true)
            track(SegmentEvent.IdentityCompleted, { address: user, account: AccountType.Discord })
          }
        } catch (error) {
          clearInterval(validationChecker)
          setIsValidated(false)
        }
      }, VALIDATION_CHECK_INTERVAL)
      setValidatingProfile(validationChecker)
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
