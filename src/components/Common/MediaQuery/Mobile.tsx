import classNames from 'classnames'

import './Mobile.css'

export default function Mobile({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={classNames(['MediaQuery__Mobile', className])}>{children}</div>
}
