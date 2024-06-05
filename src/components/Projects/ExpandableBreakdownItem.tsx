import { useState } from 'react'

import classNames from 'classnames'

import ChevronRightCircleOutline from '../Icon/ChevronRightCircleOutline.tsx'

import './ExpandableBreakdownItem.css'

interface ExpandableBreakdownItemProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  content: React.ReactNode
}

interface Props {
  item: ExpandableBreakdownItemProps
  initiallyExpanded?: boolean
}

function ExpandableBreakdownItem({ item, initiallyExpanded = false }: Props) {
  const { title, subtitle, content } = item
  const [isActive, setIsActive] = useState(initiallyExpanded)

  return (
    <div className={classNames(['ExpandableBreakdownItem', !subtitle && 'ExpandableBreakdownItem--slim'])}>
      <div role="button" className="ExpandableBreakdownItem__Header" onClick={() => setIsActive((prev) => !prev)}>
        <div>
          <div className="ExpandableBreakdownItem__Title">{title}</div>
          {subtitle && <div className="ExpandableBreakdownItem__Subtitle">{subtitle}</div>}
        </div>
        <ChevronRightCircleOutline
          className={classNames('BreakdownAccordion__Arrow', isActive && 'BreakdownAccordion__Arrow--selected')}
        />
      </div>
      <div
        className={classNames(
          'ExpandableBreakdownItem__Content',
          isActive && 'ExpandableBreakdownItem__Content--expanded',
          isActive && !subtitle && 'ExpandableBreakdownItem__Content--expanded--slim'
        )}
      >
        {content}
      </div>
    </div>
  )
}

export default ExpandableBreakdownItem
