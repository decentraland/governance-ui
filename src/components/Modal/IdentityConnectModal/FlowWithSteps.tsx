import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Modal } from 'decentraland-ui/dist/components/Modal/Modal'

import { FormatMessageFunction } from '../../../hooks/useFormatMessage.ts'
import ActionCard, { ActionCardProps } from '../../ActionCard/ActionCard'
import Text from '../../Common/Typography/Text'
import CheckCircle from '../../Icon/CheckCircle.tsx'
import Lock from '../../Icon/Lock.tsx'

import './AccountConnection.css'

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

export interface FlowWithStepsProps {
  title: string
  subtitle?: string
  timerText?: string
  steps: ActionCardProps[]
  button?: JSX.Element
  helperText?: string
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

export function getTimeFormatted(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

export function getTimerTextKey(time: number) {
  const isTimerExpired = time <= 0
  return isTimerExpired ? 'modal.identity_setup.timer_expired' : 'modal.identity_setup.timer'
}

function FlowWithSteps({ title, subtitle, timerText, steps, button, helperText }: FlowWithStepsProps) {
  return (
    <>
      <Modal.Header className="AccountConnection__Header">
        <div>{title}</div>
        {subtitle && <Text className="AccountConnection__Subtitle">{subtitle}</Text>}
        {timerText && <div className="AccountConnection__Timer">{timerText}</div>}
      </Modal.Header>
      <Modal.Content>
        {steps.map((cardProps, index) => {
          return <ActionCard key={`ActionCard--${index}`} {...cardProps} />
        })}
        {button && (
          <div className="AccountConnection__HelperContainer">
            {button}
            {helperText && helperText.length > 0 && <div className="AccountConnection__HelperText">{helperText}</div>}
          </div>
        )}
      </Modal.Content>
    </>
  )
}

export default FlowWithSteps
