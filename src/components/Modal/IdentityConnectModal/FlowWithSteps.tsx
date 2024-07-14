import { Modal } from 'decentraland-ui/dist/components/Modal/Modal'

import ActionCard, { ActionCardProps } from '../../ActionCard/ActionCard'
import Text from '../../Common/Typography/Text'

import './AccountConnection.css'

export interface FlowWithStepsProps {
  title: string
  subtitle?: string
  timerText?: string
  steps: ActionCardProps[]
  button?: JSX.Element
  helperText?: string
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
