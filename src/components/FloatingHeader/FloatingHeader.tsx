import classNames from 'classnames'

import WiderContainer from '../Common/WiderContainer'

import './FloatingHeader.css'

interface FloatingHeaderProps {
  isVisible: boolean
  title: string
  children?: React.ReactNode
}

const FloatingHeader = ({ isVisible, title, children }: FloatingHeaderProps) => {
  return (
    <div className={classNames('FloatingHeader', !isVisible && 'FloatingHeader--hidden')}>
      <WiderContainer className="FloatingHeader__Content">
        <div className="FloatingHeader__Title">{title}</div>
        <div className="FloatingHeader__Body">{children}</div>
      </WiderContainer>
      <div className="FloatingHeader__Shadow"></div>
    </div>
  )
}

export default FloatingHeader
