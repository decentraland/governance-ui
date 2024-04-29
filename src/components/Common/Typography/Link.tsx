import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'

import { isLocalLink, isMetaClick, toGovernancePathname } from '../../../helpers/browser'

import './Link.css'

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement>

const TARGET_BLANK = '_blank'

export default function Link({ target, rel, href, onClick, className, ...props }: Props) {
  const isLocal = isLocalLink(href)
  const linkTarget = !isLocal ? target || TARGET_BLANK : undefined
  const linkRel = !isLocal ? classNames(rel, 'noopener', 'noreferrer') : rel
  const navigate = useNavigate()
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e)
    }

    const isBlank = e.currentTarget.target === TARGET_BLANK
    if (isLocal && href && !isBlank && !isMetaClick(e)) {
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
      href={toGovernancePathname(href || '')}
      onClick={handleClick}
    />
  )
}
