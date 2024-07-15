import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from 'decentraland-ui/dist/components/Button/Button'

import { DISCORD_PROFILE_VERIFICATION_URL } from '../../../constants/users.ts'
import useAnalyticsTrack from '../../../hooks/useAnalyticsTrack.ts'
import useDiscordConnect from '../../../hooks/useDiscordConnect.ts'
import useFormatMessage from '../../../hooks/useFormatMessage.ts'
import { SegmentEvent } from '../../../types/events.ts'
import { AccountType } from '../../../types/users.ts'
import locations from '../../../utils/locations.ts'
import { ActionCardProps } from '../../ActionCard/ActionCard.tsx'
import Comment from '../../Icon/Comment.tsx'
import Copy from '../../Icon/Copy.tsx'
import Sign from '../../Icon/Sign.tsx'

import FlowWithSteps from './FlowWithSteps.tsx'
import {
  ModalState,
  Step,
  StepStatus,
  assignActionsToSteps,
  getStepsComponents,
  getTimeFormatted,
} from './ForumConnectionFlow.tsx'
import PostConnection from './PostConnection.tsx'

const initialSteps: Step[] = [
  {
    title: `modal.identity_setup.discord.title_step_1`,
    description: 'modal.identity_setup.discord.description_step_1',
    status: 'initial',
    icon: <Sign className="DiscordConnectStepIcon" key="sign" />,
    helpers: {
      initial: 'modal.identity_setup.discord.card_helper.step_1_initial',
      active: 'modal.identity_setup.discord.card_helper.step_1_active',
      success: 'modal.identity_setup.discord.card_helper.step_1_success',
      error: 'modal.identity_setup.discord.card_helper.step_1_error',
    },
    actionLabelKey: `modal.identity_setup.discord.action_step_1`,
  },
  {
    title: `modal.identity_setup.discord.title_step_2`,
    description: 'modal.identity_setup.discord.description_step_2',
    status: 'initial',
    icon: <Copy className="DiscordConnectStepIcon" key="copy" />,
    helpers: {
      initial: 'modal.identity_setup.discord.card_helper.step_2_initial',
      active: 'modal.identity_setup.discord.card_helper.step_2_active',
      success: 'modal.identity_setup.discord.card_helper.step_2_success',
    },
    actionLabelKey: `modal.identity_setup.discord.action_step_2`,
  },
  {
    title: `modal.identity_setup.discord.title_step_3`,
    description: 'modal.identity_setup.discord.description_step_3',
    status: 'initial',
    icon: <Comment className="DiscordConnectStepIcon" key="comment" />,
    helpers: {
      initial: DISCORD_PROFILE_VERIFICATION_URL,
      active: DISCORD_PROFILE_VERIFICATION_URL,
      success: DISCORD_PROFILE_VERIFICATION_URL,
    },
    actionLabelKey: `modal.identity_setup.discord.action_step_3`,
  },
]

const INITIAL_STATE: ModalState = {
  currentStep: 1,
  steps: initialSteps,
  isTimerActive: false,
  isValidating: false,
}

type Props = { address: string; onClose: () => void }

function DiscordConnectionFlow({ address, onClose }: Props) {
  const account = AccountType.Discord
  const navigate = useNavigate()
  const t = useFormatMessage()
  const track = useAnalyticsTrack()
  const {
    getSignedMessage: getDiscordMessage,
    copyMessageToClipboard: copyDiscordMessage,
    openChannel: openDiscordChannel,
    time: discordVerificationTime,
    isValidated: isDiscordValidationFinished,
    reset: resetDiscordConnect,
  } = useDiscordConnect()

  const [modalState, setModalState] = useState<ModalState>(INITIAL_STATE)
  const setCurrentStep = useCallback((currentStep: number) => setModalState((state) => ({ ...state, currentStep })), [])
  const setIsValidating = useCallback(
    (isValidating: boolean) => setModalState((state) => ({ ...state, isValidating })),
    []
  )
  const setIsTimerActive = useCallback(
    (isTimerActive: boolean) => setModalState((state) => ({ ...state, isTimerActive })),
    []
  )
  const setStepStatus = useCallback(
    (stepStatus: StepStatus) => {
      modalState.steps[modalState.currentStep - 1].status = stepStatus
      setModalState((state) => ({ ...state, steps: modalState.steps }))
    },
    [modalState.currentStep, modalState.steps]
  )
  const isTimerExpired = discordVerificationTime <= 0
  const timerTextKey = isTimerExpired ? 'modal.identity_setup.timer_expired' : 'modal.identity_setup.timer'

  const handleStepOneAction = useCallback(async () => {
    const STEP_NUMBER = 1
    try {
      setIsTimerActive(true)
      setStepStatus('active')
      await getDiscordMessage()
      setStepStatus('success')
      setCurrentStep(STEP_NUMBER + 1)
      track(SegmentEvent.IdentityStarted, { address, account })
    } catch (error) {
      setIsTimerActive(false)
      setStepStatus('error')
      console.error(error)
    }
  }, [account, address, getDiscordMessage, setStepStatus, track, setIsTimerActive, setCurrentStep])

  const handleStepTwoAction = useCallback(() => {
    const STEP_NUMBER = 2
    copyDiscordMessage()
    setStepStatus('success')
    setCurrentStep(STEP_NUMBER + 1)
  }, [copyDiscordMessage, setStepStatus, setCurrentStep])

  const handleStepThreeAction = useCallback(() => {
    setIsValidating(true)
    openDiscordChannel()
  }, [openDiscordChannel, setIsValidating])

  const handlePostAction = () => {
    if (isDiscordValidationFinished) {
      navigate(locations.profile({ address: address || '' }))
    }
    resetState()
    onClose()
  }

  const resetState = useCallback(() => {
    setIsTimerActive(false)
    setModalState(
      assignActionsToSteps(INITIAL_STATE, [handleStepOneAction, handleStepTwoAction, handleStepThreeAction])
    )
    setIsValidating(false)
    setStepStatus('initial')
    resetDiscordConnect()
  }, [
    setIsTimerActive,
    handleStepOneAction,
    handleStepTwoAction,
    handleStepThreeAction,
    setIsValidating,
    setStepStatus,
    resetDiscordConnect,
  ])

  useEffect(() => {
    setModalState((modalState) =>
      assignActionsToSteps(modalState, [handleStepOneAction, handleStepTwoAction, handleStepThreeAction])
    )
  }, [handleStepTwoAction, handleStepOneAction, handleStepThreeAction])

  const stepComponents = useMemo<ActionCardProps[]>(
    () => getStepsComponents(modalState.currentStep, modalState.steps, t),
    [modalState.currentStep, modalState.steps, t, handleStepOneAction, handleStepTwoAction, handleStepThreeAction]
  )

  return (
    <>
      {isDiscordValidationFinished === undefined ? (
        <FlowWithSteps
          title={t(`modal.identity_setup.${account}.title`)}
          timerText={
            modalState.isTimerActive
              ? t(timerTextKey, {
                  time: getTimeFormatted(discordVerificationTime),
                })
              : undefined
          }
          steps={stepComponents}
          button={
            <Button primary disabled loading={modalState.isValidating}>
              {t(`modal.identity_setup.${account}.action`)}
            </Button>
          }
          helperText={t(`modal.identity_setup.${account}.helper_step_${modalState.currentStep}`)}
        />
      ) : (
        <PostConnection
          account={account}
          onPostAction={handlePostAction}
          isValidated={isDiscordValidationFinished}
          address={address || undefined}
        />
      )}
    </>
  )
}

export default DiscordConnectionFlow
