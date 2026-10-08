import { createFileRoute } from '@tanstack/react-router'
import { adminSearch } from '#/lib/signups'
import { adminGate } from '#/server/admin.server'
import { listSignups } from '#/server/db.server'

// JSON for the private sign-ups page, sorted by ?sort=&dir=.
export const Route = createFileRoute('/admin/api/signups')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = await adminGate(request)
        if (denied) return denied
        const search = adminSearch.parse(Object.fromEntries(new URL(request.url).searchParams))
        return Response.json(await listSignups(search), { headers: { 'Cache-Control': 'private, no-store' } })
      },
    },
  },
})
