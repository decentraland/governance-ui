import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'
import { Back } from 'decentraland-ui/dist/components/Back/Back'
import { Container } from 'decentraland-ui/dist/components/Container/Container'

import './ContentLayout.css'
import PreventNavigation from './PreventNavigation.tsx'

type Props = {
  className?: string
  small?: boolean
  children?: React.ReactNode
  navigateBackUrl?: string
  preventNavigation?: boolean
}

export default function ContentLayout({ navigateBackUrl, className, small, preventNavigation, children }: Props) {
  const navigate = useNavigate()

  return (
    <Container className={classNames('ContentLayout', className)}>
      {navigateBackUrl && (
        <div className="ContentLayout__Back">
          <Back onClick={() => navigate(navigateBackUrl)} />
        </div>
      )}
      <div className={classNames('ContentLayout__Container', small && 'ContentLayout__Container--small')}>
        {children}
      </div>
      <PreventNavigation preventNavigation={preventNavigation} />
    </Container>
  )
}

// TODO: Remove, use the other component from /components/Layout/ContentSection
export function ContentSection(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={classNames('ContentLayout__Section', props.className)} />
}
