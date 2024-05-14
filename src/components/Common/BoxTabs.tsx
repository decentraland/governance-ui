import * as React from 'react'

import { Tabs } from 'decentraland-ui/dist/components/Tabs/Tabs'

import './BoxTabs.css'

interface BoxTabsProps {
  isFullscreen?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  className?: string
  children?: React.ReactNode
}

class BoxTabs extends React.PureComponent<BoxTabsProps> {
  static Left = Tabs.Left
  static Right = Tabs.Right
  static Tab = Tabs.Tab

  render() {
    return (
      <div className="BoxTabs">
        <Tabs {...this.props} />
      </div>
    )
  }
}

export default BoxTabs
