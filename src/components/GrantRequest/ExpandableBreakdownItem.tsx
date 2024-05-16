import { useState } from 'react'

import classNames from 'classnames'

import ChevronRightCircleOutline from '../Icon/ChevronRightCircleOutline'

import './ExpandableBreakdownItem.css'

export interface BreakdownItem {
  title: string
  subtitle: string
  content: React.ReactNode
}

interface Props {
  item: BreakdownItem
  initiallyExpanded?: boolean
}

function ExpandableBreakdownItem({ item, initiallyExpanded = false }: Props) {
  const { title, subtitle, content } = item
  const [isActive, setIsActive] = useState(initiallyExpanded)

  return (
    <div className="ExpandableBreakdownItem">
      <div role="button" className="ExpandableBreakdownItem__Header" onClick={() => setIsActive((prev) => !prev)}>
        <div>
          <div className="BreakdownItem__Title">{title}</div>
          <div className="BreakdownItem__Subtitle">{subtitle}</div>
        </div>
        <div>
          <span>
            <ChevronRightCircleOutline
              className={classNames('BreakdownAccordion__Arrow', isActive && 'BreakdownAccordion__Arrow--selected')}
            />
          </span>
        </div>
      </div>
      <div
        className={classNames(
          'ExpandableBreakdownItem__Content',
          isActive && 'ExpandableBreakdownItem__Content--expanded'
        )}
      >
        {content}
      </div>
    </div>
  )
}

export default ExpandableBreakdownItem
