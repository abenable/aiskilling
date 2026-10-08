// Worker entry: canonical host + baseline security headers around TanStack Start's handler.
import handler, { createServerEntry } from '@tanstack/react-start/server-entry'
import { adminGate } from '#/server/admin.server'

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

// Match how the router reads paths (decoded, case-insensitive, repeated slashes collapsed) so /ADMIN or //admin can't skip the gate.
function normalisedPath(pathname: string) {
  try {
    return decodeURIComponent(pathname).toLowerCase().replace(/\/{2,}/g, '/')
  } catch {
    return '/admin' // malformed escapes: treat as private
  }
}

export default createServerEntry({
  async fetch(request) {
    const url = new URL(request.url)
    // One canonical URL per page: apex host, no trailing slash (permanent, so search engines merge them).
    const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') || '/' : url.pathname
    if (url.hostname.startsWith('www.') || path !== url.pathname) {
      url.hostname = url.hostname.replace(/^www\./, '')
      url.pathname = path
      return Response.redirect(url.toString(), 301)
    }
    // Gate the page here so the browser shows its login box; the data handlers check again themselves.
    const admin = /^\/admin(\/|$)/.test(normalisedPath(url.pathname))
    if (admin) {
      const denied = await adminGate(request)
      if (denied) return denied
    }
    const res = await handler.fetch(request)
    const out = new Response(res.body, res)
    if (admin) {
      out.headers.set('Cache-Control', 'private, no-store')
      out.headers.set('X-Robots-Tag', 'noindex, nofollow')
    }
    for (const [k, v] of Object.entries(securityHeaders)) out.headers.set(k, v)
    return out
  },
})
