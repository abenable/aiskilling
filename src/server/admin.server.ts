// Server-only: password gate for the private /admin area. Importing this from client code fails the build.
import '@tanstack/react-start/server-only'
import { env } from 'cloudflare:workers'

const enc = new TextEncoder()

/** Timing-safe compare ("double HMAC"): both sides are signed with a throwaway key, so comparison time reveals nothing about the secret. */
async function sameSecret(a: string, b: string) {
  const key = await crypto.subtle.importKey('raw', crypto.getRandomValues(new Uint8Array(32)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const [x, y] = await Promise.all([crypto.subtle.sign('HMAC', key, enc.encode(a)), crypto.subtle.sign('HMAC', key, enc.encode(b))])
  const [dx, dy] = [new Uint8Array(x), new Uint8Array(y)]
  return dx.every((v, i) => v === dy[i])
}

/**
 * Password gate for everything under /admin (page, JSON and CSV), using the browser's built-in login box.
 * Username "admin"; the password is the ADMIN_PASSWORD secret. Wrong guesses are rate limited per IP.
 */
export async function adminGate(request: Request): Promise<Response | null> {
  if (!env.ADMIN_PASSWORD) return new Response('Admin login is not configured.', { status: 503 })
  const [scheme, encoded] = (request.headers.get('Authorization') ?? '').split(' ')
  if (scheme === 'Basic' && encoded) {
    let user = ''
    let pass = ''
    try {
      ;[user, pass] = atob(encoded).split(/:(.*)/s)
    } catch {}
    if (user === 'admin' && (await sameSecret(pass ?? '', env.ADMIN_PASSWORD))) return null
    const ip = request.headers.get('cf-connecting-ip') ?? 'local'
    if (!(await env.JOIN_LIMITER.limit({ key: `admin:${ip}` })).success) {
      return new Response('Too many attempts. Wait a minute and try again.', { status: 429 })
    }
  }
  return new Response('Login required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="AI Skilling admin", charset="UTF-8"', 'Cache-Control': 'no-store' },
  })
}
