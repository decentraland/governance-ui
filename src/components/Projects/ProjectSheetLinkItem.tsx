import Link from '../Common/Typography/Link.tsx'

import './ProjectSheetLinkItem.css'

interface Props {
  label: string
  icon: React.ReactNode
  href: string
  key?: string | number
}

function ProjectSheetLinkItem({ href, icon, label, key }: Props) {
  return (
    <Link className="ExpandableBreakdownItem ExpandableBreakdownItem--slim" key={key} href={href} target="_blank">
      <div className="ProjectSheetLinkItem__Title">
        {icon} {label}
      </div>
    </Link>
  )
}

export default ProjectSheetLinkItem
