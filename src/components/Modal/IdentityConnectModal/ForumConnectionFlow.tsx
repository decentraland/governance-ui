import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from 'decentraland-ui/dist/components/Button/Button'

import useAnalyticsTrack from '../../../hooks/useAnalyticsTrack.ts'
import useFormatMessage, { FormatMessageFunction } from '../../../hooks/useFormatMessage.ts'
import useForumConnect, { THREAD_URL } from '../../../hooks/useForumConnect.ts'
import { SegmentEvent } from '../../../types/events.ts'
import { AccountType } from '../../../types/users.ts'
import locations from '../../../utils/locations.ts'
import { ActionCardProps } from '../../ActionCard/ActionCard.tsx'
import CheckCircle from '../../Icon/CheckCircle.tsx'
import Comment from '../../Icon/Comment.tsx'
import Copy from '../../Icon/Copy.tsx'
import Lock from '../../Icon/Lock.tsx'
import Sign from '../../Icon/Sign.tsx'

import { getHelperTextKey, getTimeFormatted } from './AccountsConnectModalOld.tsx'
import FlowWithSteps from './FlowWithSteps.tsx'
import PostConnection from './PostConnection.tsx'

export type StepStatus = 'initial' | 'active' | 'success' | 'error'

export interface Step {
  title: string
  description: string
  status: StepStatus
  icon: React.ReactNode
  helpers: StepHelperKeys
  action?: () => void
  actionLabelKey?: string
}

export interface ModalState {
  currentStep: number
  steps: Step[]
  isTimerActive: boolean
  isValidating: boolean
}

export type StepHelperKeys = {
  initial: string
  active: string
  success: string
  error?: string
}

const initialSteps: Step[] = [
  {
    title: `modal.identity_setup.forum.title_step_1`,
    description: 'modal.identity_setup.forum.description_step_1',
    status: 'initial',
    icon: <Sign className="ForumConnectStepIcon" key="sign" />,
    helpers: {
      initial: 'modal.identity_setup.forum.card_helper.step_1_initial',
      active: 'modal.identity_setup.forum.card_helper.step_1_active',
      success: 'modal.identity_setup.forum.card_helper.step_1_success',
      error: 'modal.identity_setup.forum.card_helper.step_1_error',
    },
    actionLabelKey: `modal.identity_setup.forum.action_step_1`,
  },
  {
    title: `modal.identity_setup.forum.title_step_2`,
    description: 'modal.identity_setup.forum.description_step_2',
    status: 'initial',
    icon: <Copy className="ForumConnectStepIcon" key="copy" />,
    helpers: {
      initial: 'modal.identity_setup.forum.card_helper.step_2_initial',
      active: 'modal.identity_setup.forum.card_helper.step_2_active',
      success: 'modal.identity_setup.forum.card_helper.step_2_success',
    },
    actionLabelKey: `modal.identity_setup.forum.action_step_2`,
  },
  {
    title: `modal.identity_setup.forum.title_step_3`,
    description: 'modal.identity_setup.forum.description_step_3',
    status: 'initial',
    icon: <Comment className="ForumConnectStepIcon" key="comment" />,
    helpers: {
      initial: THREAD_URL,
      active: THREAD_URL,
      success: THREAD_URL,
    },
    actionLabelKey: `modal.identity_setup.forum.action_step_3`,
  },
]

const INITIAL_STATE: ModalState = {
  currentStep: 1,
  steps: initialSteps,
  isTimerActive: false,
  isValidating: false,
}

function getStepActionComponent(step: Step, isCompleted: boolean, isDisabled: boolean, t: FormatMessageFunction) {
  if (isCompleted) {
    return <CheckCircle size="24" outline />
  }

  if (isDisabled) {
    return <Lock />
  }

  return (
    <Button basic onClick={step.action}>
      {t(step.actionLabelKey)}
    </Button>
  )
}

export function getStepsComponents(currentStep: number, steps: Step[], t: FormatMessageFunction): ActionCardProps[] {
  return steps.map((step, index) => {
    const stepIdx = index + 1
    const isDisabled = stepIdx > currentStep
    const isCompleted = stepIdx < currentStep && stepIdx <= 1

    return {
      title: t(step.title),
      description: t(step.description),
      icon: step.icon,
      action: getStepActionComponent(step, isCompleted, isDisabled, t),
      isDisabled,
      helper: t(step.helpers[step.status]),
    }
  })
}

export function assignActionsToSteps(state: ModalState, actions: (() => unknown)[]) {
  const newState = { ...state }
  newState.steps.forEach((step, index) => {
    step.action = actions[index]
  })
  return newState
}

type Props = { address: string; onClose: () => void }

function ForumConnectionFLow({ address, onClose }: Props) {
  const account = AccountType.Forum
  const navigate = useNavigate()
  const t = useFormatMessage()
  const track = useAnalyticsTrack()

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

  const {
    getSignedMessage: getForumMessage,
    copyMessageToClipboard: copyForumMessage,
    openThread: openForumThread,
    time: forumVerificationTime,
    isValidated: isForumValidationFinished,
    reset: resetForumConnect,
  } = useForumConnect()
  const isTimerExpired = forumVerificationTime <= 0
  const timerTextKey = isTimerExpired ? 'modal.identity_setup.timer_expired' : 'modal.identity_setup.timer'

  const handleStepOneAction = useCallback(async () => {
    const STEP_NUMBER = 1
    try {
      setIsTimerActive(true)
      setStepStatus('active')
      await getForumMessage()
      setStepStatus('success')
      setCurrentStep(STEP_NUMBER + 1)
      track(SegmentEvent.IdentityStarted, { address, account })
    } catch (error) {
      setIsTimerActive(false)
      setStepStatus('error')
      console.error(error)
    }
  }, [account, address, getForumMessage, setStepStatus, track, setIsTimerActive, setCurrentStep])

  const handleStepTwoAction = useCallback(() => {
    const STEP_NUMBER = 2
    copyForumMessage()
    setStepStatus('success')
    setCurrentStep(STEP_NUMBER + 1)
  }, [copyForumMessage, setStepStatus, setCurrentStep])

  const handleStepThreeAction = useCallback(() => {
    setIsValidating(true)
    openForumThread()
  }, [openForumThread, setIsValidating])

  const handlePostAction = () => {
    if (isForumValidationFinished) {
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
    resetForumConnect()
  }, [
    setIsTimerActive,
    handleStepOneAction,
    handleStepTwoAction,
    handleStepThreeAction,
    setIsValidating,
    setStepStatus,
    resetForumConnect,
  ])

  useEffect(() => {
    setModalState((modalState) =>
      assignActionsToSteps(modalState, [handleStepOneAction, handleStepTwoAction, handleStepThreeAction])
    )
  }, [handleStepOneAction, handleStepTwoAction, handleStepThreeAction])

  const stepComponents = useMemo<ActionCardProps[]>(
    () => getStepsComponents(modalState.currentStep, modalState.steps, t),
    [modalState.currentStep, modalState.steps, handleStepOneAction, handleStepTwoAction, handleStepThreeAction]
  )

  return (
    <>
      {!isForumValidationFinished ? (
        <FlowWithSteps
          title={t('modal.identity_setup.forum.title')}
          timerText={
            modalState.isTimerActive
              ? t(timerTextKey, {
                  time: getTimeFormatted(forumVerificationTime),
                })
              : undefined
          }
          steps={stepComponents}
          button={
            <Button primary disabled loading={modalState.isValidating}>
              {t('modal.identity_setup.forum.action')}
            </Button>
          }
          helperText={t(getHelperTextKey(modalState.currentStep, account))}
        />
      ) : (
        <PostConnection
          account={account}
          onPostAction={handlePostAction}
          isValidated={isForumValidationFinished}
          address={address || undefined}
        />
      )}
    </>
  )
}

export default ForumConnectionFLow
