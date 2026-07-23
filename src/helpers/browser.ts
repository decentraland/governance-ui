export function scrollToAnchor(anchor: string, pixelsOverAnchor = 0) {
  if (typeof window === 'undefined') return
  const element = document.getElementById(anchor)
  if (element) {
    const bounding = element.getBoundingClientRect()
    const position = bounding.top + window.scrollY - pixelsOverAnchor
    window.scrollTo({
      top: position,
      behavior: 'smooth',
    })
  }
}

export function toGovernancePathname(pathname: string) {
  if (location.pathname.indexOf('/governance') === 0) {
    return `/governance${pathname}`
  }

  return pathname
}

export function isMetaClick(event: React.MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
}

// Leading control characters are tolerated so obfuscated forms like "\tjavascript:" are still caught.
// eslint-disable-next-line no-control-regex -- matching leading control characters is intentional
const DANGEROUS_HREF_SCHEME = /^[\u0000-\u0020]*(javascript|data|vbscript):/i

// True for hrefs whose scheme can execute script or render active content if navigated to.
// The href sinks (Link's rendered anchor, useAnalyticsTrackLink's window.location.href) must
// drop such hrefs rather than render or navigate to them. Note: isRelativeLink intentionally
// classifies these as "relative", so guarding a navigation sink requires this check explicitly —
// do not rely on isRelativeLink to filter dangerous schemes.
export function hasDangerousScheme(href?: string | null) {
  return typeof href === 'string' && DANGEROUS_HREF_SCHEME.test(href)
}

export function isRelativeLink(href?: string | null) {
  return (
    typeof href === 'string' && !href.startsWith('https://') && !href.startsWith('http://') && !href.startsWith('//')
  )
}
