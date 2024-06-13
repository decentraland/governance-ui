import classNames from 'classnames'

import { PillColor } from '../Common/Pill'

import './HeroBanner.css'

export default function HeroBanner({
  active,
  color,
  className,
}: {
  active: boolean
  color: PillColor
  className?: string
}) {
  return (
    <>
      <div
        className={classNames(
          'HeroBanner',
          active && `HeroBanner--${color}`,
          !active && 'HeroBanner--finished',
          className
        )}
      ></div>
      {active && (
        <div
          className={classNames('HeroBanner', 'HeroBanner__Gradient', `HeroBanner__Gradient--${color}`, className)}
        />
      )}
    </>
  )
}
