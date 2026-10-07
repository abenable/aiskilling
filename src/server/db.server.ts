// Server-only: D1 + rate limiter access. Importing this from client code fails the build.
import '@tanstack/react-start/server-only'
import { env } from 'cloudflare:workers'
import type { ActivitySlug } from '#/content'
import type { EventItem, JoinInput } from '#/lib/schemas'

export async function upcomingEvents(kind?: ActivitySlug, limit = 6): Promise<EventItem[]> {
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, kind, title, starts_at AS startsAt, location, url, summary
         FROM events
        WHERE datetime(starts_at) >= datetime('now') AND (?1 IS NULL OR kind = ?1)
        ORDER BY datetime(starts_at)
        LIMIT ?2`,
    )
      .bind(kind ?? null, limit)
      .all<EventItem>()
    return results
  } catch (err) {
    // ponytail: the page still renders its empty state if D1 is unreachable; the error lands in Workers logs.
    console.error('upcomingEvents failed', err)
    return []
  }
}

export async function saveSignup(s: JoinInput) {
  await env.DB.prepare(
    `INSERT INTO signups (name, email, audience, interests, message)
     VALUES (?1, ?2, ?3, ?4, ?5)
     ON CONFLICT (email) DO UPDATE SET
       name = excluded.name, audience = excluded.audience, interests = excluded.interests,
       message = coalesce(excluded.message, signups.message), updated_at = datetime('now')`,
  )
    .bind(s.name, s.email, s.audience, s.interests.join(','), s.message || null)
    .run()
}

export async function allowJoin(ip: string) {
  const { success } = await env.JOIN_LIMITER.limit({ key: ip })
  return success
}
