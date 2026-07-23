import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'

import { hasDangerousScheme, isMetaClick, isRelativeLink, toGovernancePathname } from '../../../helpers/browser'

import './Link.css'

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement>

const TARGET_BLANK = '_blank'

export default function Link({ target, rel, href, onClick, className, ...props }: Props) {
  // Drop hrefs whose scheme could execute script (javascript:/data:/vbscript:) so they can never be
  // rendered as an executable anchor or passed to navigate(). react-markdown/DOMPurify already strip
  // these upstream; this is a last line of defense at the render sink.
  const safeHref = hasDangerousScheme(href) ? undefined : href
  const isRelative = isRelativeLink(safeHref)
  const linkTarget = !isRelative ? target || TARGET_BLANK : undefined
  const linkRel = !isRelative ? classNames(rel, 'noopener', 'noreferrer') : rel
  const navigate = useNavigate()
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e)
    }

    const isBlank = e.currentTarget.target === TARGET_BLANK
    if (isRelative && safeHref && !isBlank && !isMetaClick(e) && !e.defaultPrevented) {
      e.preventDefault()
      navigate(safeHref)
    }
  }

  return (
    <a
      {...props}
      className={classNames('Link', (onClick || safeHref) && 'Link--pointer', className)}
      target={linkTarget}
      rel={linkRel}
      href={isRelative ? toGovernancePathname(safeHref || '') : safeHref}
      onClick={handleClick}
    />
  )
}
