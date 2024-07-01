import Link from '../Common/Typography/Link.tsx'

import './ProjectViewLinkItem.css'

interface Props {
  label: string
  icon: React.ReactNode
  href: string
}

function ProjectViewLinkItem({ href, icon, label }: Props) {
  return (
    <Link className="ExpandableBreakdownItem ExpandableBreakdownItem--slim" href={href} target="_blank">
      <div className="ProjectViewLinkItem__Title">
        {icon} {label}
      </div>
    </Link>
  )
}

export default ProjectViewLinkItem
