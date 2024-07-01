import { ReactNode } from 'react'

import classNames from 'classnames'

import './ProjectVerticalTab.css'

interface Props {
  onClick: () => void
  active: boolean
  children: ReactNode
}

function ProjectVerticalTab({ onClick, active, children }: Props) {
  return (
    <div className={classNames(['ProjectVerticalTab', active && 'ProjectVerticalTab--active'])} onClick={onClick}>
      {children}
    </div>
  )
}

export default ProjectVerticalTab
