/* eslint-disable */
/**
 * Link checker (warning-only).
 *
 * Scans product-owned source files for http(s) URLs and verifies each one
 * resolves (HTTP status < 400). Broken links are reported as GitHub Actions
 * warning annotations and printed in a summary, but the script ALWAYS exits 0
 * so it never fails the build.
 *
 * Delegate-supplied links (src/utils/delegates/candidates.json) are skipped on
 * purpose: keeping those up to date is the responsibility of each delegate.
 *
 * Usage: node scripts/check-links.js
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'src')

// Directories/files to scan for product-owned links.
const SCAN_TARGETS = ['intl', 'constants', 'components', 'pages', 'hooks', 'utils']

// Files/paths we never want to check.
const EXCLUDE_PATHS = [
  // Delegates maintain their own profile links.
  path.join('utils', 'delegates', 'candidates.json'),
]

// Skip test fixtures, stories and mocks.
const EXCLUDE_FILE_PATTERN = /(\.test\.|\.stories\.|\.spec\.|__mocks__|__tests__)/

// Hosts/URLs that are placeholders or known-unverifiable (test fixtures, etc.).
const IGNORE_URL_PATTERN =
  /(localhost|127\.0\.0\.1|0\.0\.0\.0|example\.com|valid-image\.com|invalid-image\.com|\{|\}|\$\{)/

// API/SDK base URLs that are only ever used with a path appended, so they
// (correctly) return 4xx at their root. Checking them produces false positives.
const IGNORE_EXACT = new Set([
  'https://api.decentraland.org',
  'https://cdn.segment.com/analytics.js/v1/',
])

const URL_REGEX = /https?:\/\/[^\s"'`)<>\]\\]+/g
const SCANNED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.md'])

const TIMEOUT_MS = 15000
const CONCURRENCY = 10
const USER_AGENT =
  'Mozilla/5.0 (compatible; governance-ui-link-checker/1.0; +https://governance.decentraland.org)'

function walk(dir) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walk(full))
    } else if (SCANNED_EXTENSIONS.has(path.extname(entry.name))) {
      out.push(full)
    }
  }
  return out
}

function isExcluded(file) {
  const rel = path.relative(SRC, file)
  if (EXCLUDE_FILE_PATTERN.test(rel)) return true
  return EXCLUDE_PATHS.some((p) => rel === p || rel.startsWith(p + path.sep))
}

function cleanUrl(raw) {
  // Trim trailing punctuation commonly captured by the regex.
  return raw.replace(/[.,;:]+$/, '')
}

function collectLinks() {
  const links = new Map() // url -> Set(relative file paths)
  const files = SCAN_TARGETS.flatMap((t) => walk(path.join(SRC, t)))
  for (const file of files) {
    if (isExcluded(file)) continue
    const content = fs.readFileSync(file, 'utf8')
    const matches = content.match(URL_REGEX)
    if (!matches) continue
    for (const m of matches) {
      const url = cleanUrl(m)
      if (IGNORE_URL_PATTERN.test(url) || IGNORE_EXACT.has(url)) continue
      if (!links.has(url)) links.set(url, new Set())
      links.get(url).add(path.relative(ROOT, file))
    }
  }
  return links
}

async function checkUrl(url) {
  const attempt = async (method) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
      })
      return res.status
    } finally {
      clearTimeout(timer)
    }
  }
  try {
    // Prefer a lightweight HEAD; fall back to GET when HEAD is unsupported/blocked.
    let status = await attempt('HEAD')
    if (status >= 400 || status === 0) status = await attempt('GET')
    return { url, status, ok: status > 0 && status < 400 }
  } catch (err) {
    return { url, status: 0, ok: false, error: err.code || err.name || String(err) }
  }
}

async function run() {
  const links = collectLinks()
  const urls = [...links.keys()].sort()
  console.log(`Checking ${urls.length} product-owned link(s)...\n`)

  const results = []
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY)
    results.push(...(await Promise.all(batch.map(checkUrl))))
  }

  const broken = results.filter((r) => !r.ok)

  for (const r of results.sort((a, b) => a.url.localeCompare(b.url))) {
    console.log(`${r.ok ? 'OK  ' : 'WARN'} ${String(r.status || r.error).padEnd(6)} ${r.url}`)
  }

  if (broken.length > 0) {
    console.log(`\n::group::⚠️ ${broken.length} broken link(s) found`)
    for (const r of broken) {
      const where = [...links.get(r.url)].join(', ')
      const detail = r.status ? `HTTP ${r.status}` : r.error || 'unreachable'
      // GitHub Actions warning annotation (does not fail the build).
      console.log(`::warning title=Broken link::${r.url} (${detail}) — referenced in: ${where}`)
    }
    console.log('::endgroup::')
    console.log(`\n⚠️  ${broken.length}/${urls.length} link(s) need attention (warning only).`)
  } else {
    console.log(`\n✅ All ${urls.length} links resolved.`)
  }

  // Always succeed: this is a warning, not a gate.
  process.exit(0)
}

run().catch((err) => {
  // Even on unexpected errors, do not break the build.
  console.warn('::warning title=Link checker error::' + (err && err.stack ? err.stack : err))
  process.exit(0)
})
