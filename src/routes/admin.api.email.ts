import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { adminGate } from '#/server/admin.server'
import { logSentEmail } from '#/server/db.server'
import { sendDirectedEmail } from '#/server/email.server'

const emailInput = z.object({
  signupId: z.number().int().positive().nullable(),
  to: z.string().trim().toLowerCase().max(160).pipe(z.email('Enter a valid email address.')),
  subject: z.string().trim().min(1, 'Add a subject.').max(200, 'Keep the subject under 200 characters.'),
  body: z.string().trim().min(1, 'Write a message first.').max(5000, 'Please keep it under 5000 characters.'),
})

// Send one directed email from the admin composer and log it. Password-gated like the rest of /admin.
export const Route = createFileRoute('/admin/api/email')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const denied = await adminGate(request)
        if (denied) return denied
        let input: unknown
        try {
          input = await request.json()
        } catch {
          return Response.json({ error: 'Invalid request body.' }, { status: 400 })
        }
        const parsed = emailInput.safeParse(input)
        if (!parsed.success) {
          return Response.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' }, { status: 400 })
        }
        const { signupId, to, subject, body } = parsed.data
        try {
          await sendDirectedEmail({ to, subject, body })
        } catch (err) {
          console.error('directed email failed', err)
          return Response.json({ error: 'Sending failed. Check the build logs and try again.' }, { status: 502 })
        }
        await logSentEmail({ signupId, to, subject, body })
        return Response.json({ ok: true }, { headers: { 'Cache-Control': 'private, no-store' } })
      },
    },
  },
})
