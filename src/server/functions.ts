// Typed RPC boundary. Handlers run on the Worker; the client bundle only gets fetch stubs.
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { joinInput, upcomingInput } from '#/lib/schemas'
import { allowJoin, saveSignup, upcomingEvents } from './db.server'

export const getUpcoming = createServerFn({ method: 'GET' })
  .validator(upcomingInput)
  .handler(({ data }) => upcomingEvents(data.kind))

export const joinCommunity = createServerFn({ method: 'POST' })
  .validator(joinInput)
  .handler(async ({ data }) => {
    // Bots fill the hidden field; answer as if it worked and store nothing.
    if (data.website) return { ok: true as const }

    const ip = getRequestHeader('cf-connecting-ip') ?? 'local'
    if (!(await allowJoin(ip))) {
      throw new Error('Too many attempts from your connection. Please wait a minute and try again.')
    }
    await saveSignup(data)
    return { ok: true as const }
  })
