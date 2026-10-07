// Worker entry: canonical host + baseline security headers around TanStack Start's handler.
import handler, { createServerEntry } from '@tanstack/react-start/server-entry'

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

export default createServerEntry({
  async fetch(request) {
    const url = new URL(request.url)
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4)
      return Response.redirect(url.toString(), 301)
    }
    const res = await handler.fetch(request)
    const out = new Response(res.body, res)
    for (const [k, v] of Object.entries(securityHeaders)) out.headers.set(k, v)
    return out
  },
})
