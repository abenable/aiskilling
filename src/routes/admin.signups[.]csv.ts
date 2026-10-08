import { createFileRoute } from '@tanstack/react-router'
import { adminSearch, signupsCsv } from '#/lib/signups'
import { adminGate } from '#/server/admin.server'
import { listSignups } from '#/server/db.server'

// CSV download of every sign-up, in the same order as the page (?sort=&dir=).
export const Route = createFileRoute('/admin/signups.csv')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = await adminGate(request)
        if (denied) return denied
        const search = adminSearch.parse(Object.fromEntries(new URL(request.url).searchParams))
        const day = new Date().toISOString().slice(0, 10)
        return new Response(signupsCsv(await listSignups(search)), {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="aiskilling-signups-${day}.csv"`,
            'Cache-Control': 'private, no-store',
          },
        })
      },
    },
  },
})
