import React, { useEffect, useRef } from 'react'

import classNames from 'classnames'
import { Close } from 'decentraland-ui/dist/components/Close/Close'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'

import Heading from '../Common/Typography/Heading'

import './GovernanceSidebar.css'
import Overlay from './Overlay'

type Props = {
  visible: boolean
  isLoading?: boolean
  children: React.ReactNode
  title: string | React.ReactNode
  onShow?: () => void
  onHide?: () => void
  onClose: () => void
  className?: string
}

const ANIMATION_DURATION = 500

export default function GovernanceSidebar({
  visible = false,
  isLoading,
  title,
  onShow,
  onHide,
  onClose,
  children,
  className,
}: Props) {
  const prevVisible = useRef(visible)
  useEffect(() => {
    if (prevVisible.current && !visible) {
      if (onHide) {
        onHide()
      }
    } else if (!prevVisible.current && visible) {
      if (onShow) {
        setTimeout(onShow, ANIMATION_DURATION)
      }
    }
    prevVisible.current = visible
  }, [onHide, onShow, visible])

  return (
    <>
      <Overlay isOpen={visible} onClick={onClose} />
      {isLoading ? (
        <Loader />
      ) : (
        <div className={classNames(className, 'GovernanceSidebar', visible && 'GovernanceSidebar--open')}>
          <div className="GovernanceSidebar__TitleContainer">
            {typeof title === 'string' ? (
              <Heading size="xs" className="GovernanceSidebar__Title" weight="semi-bold">
                {title}
              </Heading>
            ) : (
              title
            )}
            <Close onClick={onClose} />
          </div>
          <div className="GovernanceSidebar__ContentContainer">{children}</div>
        </div>
      )}
    </>
  )
}
