import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'

import { isMetaClick, isRelativeLink, toGovernancePathname } from '../../../helpers/browser'

import './Link.css'

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement>

const TARGET_BLANK = '_blank'

export default function Link({ target, rel, href, onClick, className, ...props }: Props) {
  const isRelative = isRelativeLink(href)
  const linkTarget = !isRelative ? target || TARGET_BLANK : undefined
  const linkRel = !isRelative ? classNames(rel, 'noopener', 'noreferrer') : rel
  const navigate = useNavigate()
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e)
    }

    const isBlank = e.currentTarget.target === TARGET_BLANK
    if (isRelative && href && !isBlank && !isMetaClick(e)) {
      e.preventDefault()
      navigate(href)
    }
  }

  return (
    <a
      {...props}
      className={classNames('Link', (onClick || href) && 'Link--pointer', className)}
      target={linkTarget}
      rel={linkRel}
      href={isRelative ? toGovernancePathname(href || '') : href}
      onClick={handleClick}
    />
  )
}
