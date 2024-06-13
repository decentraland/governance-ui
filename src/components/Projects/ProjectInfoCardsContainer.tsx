import classNames from 'classnames'

import './ProjectInfoCardsContainer.css'

interface Props {
  children: React.ReactNode
  slim?: boolean
}

export default function ProjectInfoCardsContainer({ slim, children }: Props) {
  return (
    <div className={classNames('ProjectInfoCardsContainer', slim && 'ProjectInfoCardsContainer--slim')}>{children}</div>
  )
}
