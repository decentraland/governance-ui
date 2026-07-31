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

import FlowWithSteps, {
  ModalState,
  Step,
  StepStatus,
  assignActionsToSteps,
  getStepsComponents,
  getTimeFormatted,
  getTimerTextKey,
} from './FlowWithSteps.tsx'
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

// Step status and action are assigned by mutating the step objects, so every mount and every reset
// needs its own copies. Sharing initialSteps carries a previous attempt's status into the next one.
function createInitialState(): ModalState {
  return { ...INITIAL_STATE, steps: initialSteps.map((step) => ({ ...step })) }
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

  const [modalState, setModalState] = useState<ModalState>(createInitialState)
  const setCurrentStep = useCallback((currentStep: number) => setModalState((state) => ({ ...state, currentStep })), [])
  const setIsValidating = useCallback(
    (isValidating: boolean) => setModalState((state) => ({ ...state, isValidating })),
    []
  )
  // Memoised like the other setters: it is a dependency of handleStepOneAction, which the effect
  // below depends on, so a new identity every render makes that effect re-run and set state forever.
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
      assignActionsToSteps(createInitialState(), [handleStepOneAction, handleStepTwoAction, handleStepThreeAction])
    )
    setIsValidating(false)
    resetDiscordConnect()
  }, [
    setIsTimerActive,
    handleStepOneAction,
    handleStepTwoAction,
    handleStepThreeAction,
    setIsValidating,
    resetDiscordConnect,
  ])

  useEffect(() => {
    setModalState((modalState) =>
      assignActionsToSteps(modalState, [handleStepOneAction, handleStepTwoAction, handleStepThreeAction])
    )
  }, [handleStepTwoAction, handleStepOneAction, handleStepThreeAction])

  const stepComponents = useMemo<ActionCardProps[]>(
    () => getStepsComponents(modalState.currentStep, modalState.steps, t),
    [modalState.currentStep, modalState.steps, handleStepOneAction, handleStepTwoAction, handleStepThreeAction, t]
  )

  return (
    <>
      {isDiscordValidationFinished === undefined ? (
        <FlowWithSteps
          title={t(`modal.identity_setup.${account}.title`)}
          timerText={
            modalState.isTimerActive
              ? t(getTimerTextKey(discordVerificationTime), {
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
