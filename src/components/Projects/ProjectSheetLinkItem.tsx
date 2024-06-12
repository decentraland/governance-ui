import Link from '../Common/Typography/Link.tsx'

import './ProjectSheetLinkItem.css'

interface Props {
  label: string
  icon: React.ReactNode
  href: string
}

function ProjectSheetLinkItem({ href, icon, label }: Props) {
  return (
    <Link className="ExpandableBreakdownItem ExpandableBreakdownItem--slim" href={href} target="_blank">
      <div className="ProjectSheetLinkItem__Title">
        {icon} {label}
      </div>
    </Link>
  )
}

export default ProjectSheetLinkItem
