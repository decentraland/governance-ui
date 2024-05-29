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
    <div className="ExpandableBreakdownItem">
      <div role="button" className="ExpandableBreakdownItem__Header" onClick={() => setIsActive((prev) => !prev)}>
        <div>
          <div className="BreakdownItem__Title">{title}</div>
          {subtitle && <div className="BreakdownItem__Subtitle">{subtitle}</div>}
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
