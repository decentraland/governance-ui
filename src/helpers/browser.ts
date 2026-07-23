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

const DANGEROUS_SCHEME = /^(javascript|data|vbscript):/i

// Remove all ascii control and space characters (code point <= 0x20). Browsers strip
// tab/newline/carriage-return anywhere in a url and ignore leading control characters, so a
// scheme obfuscated with an embedded tab/newline or leading whitespace must be treated the same
// as the bare scheme. Done with a code-point filter rather than a control-character regex so it
// needs no eslint exception.
function stripControlAndSpace(value: string): string {
  return [...value].filter((char) => char.charCodeAt(0) > 0x20).join('')
}

// True for hrefs whose scheme can execute script or render active content if navigated to. The two
// sinks that render or navigate to an href (the Link component and the analytics click handler)
// must drop such hrefs, and must check this explicitly because isRelativeLink intentionally
// classifies these as relative.
export function hasDangerousScheme(href?: string | null) {
  if (typeof href !== 'string') return false
  return DANGEROUS_SCHEME.test(stripControlAndSpace(href))
}

export function isRelativeLink(href?: string | null) {
  return (
    typeof href === 'string' && !href.startsWith('https://') && !href.startsWith('http://') && !href.startsWith('//')
  )
}

export type LinkClickAction = 'block' | 'navigate' | 'default'

// Decides what a tracked link click should do. Kept pure (no dom/react) so the safety contract at
// the navigation sink can be unit-tested:
// - 'block': dangerous scheme — the caller must preventDefault so neither an explicit
//   window.location assignment nor the browser's default anchor navigation can execute it.
// - 'navigate': external new-tab link — preventDefault and navigate via window.location.
// - 'default': relative / same-tab / meta-click / already-prevented — let the browser handle it.
export function resolveLinkClickAction(
  href: string | undefined,
  target: string | undefined,
  isMeta: boolean,
  defaultPrevented: boolean
): LinkClickAction {
  if (hasDangerousScheme(href)) return 'block'
  if (!isRelativeLink(href) && target === '_blank' && !isMeta && !defaultPrevented) return 'navigate'
  return 'default'
}
