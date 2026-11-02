// Server-only: Email Sending binding access. Importing this from client code fails the build.
import '@tanstack/react-start/server-only'
import { env } from 'cloudflare:workers'
import { joinConfirmationEmail } from '#/lib/email-templates'

export const sender = {
	address: 'no-reply@aiskilling.dev',
	name: 'AI Skilling',
}

interface SendEmailOptions {
	to: string
	subject: string
	html: string
	text: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
	if (!env.EMAIL) {
		// ponytail: local dev and tests have no binding; log instead of throwing.
		console.warn('[EMAIL] EMAIL binding not available — email skipped')
		console.log(`[DEV] "${subject}" → ${to}`)
		return
	}
	const message: Parameters<typeof env.EMAIL.send>[0] = {
		to,
		from: { email: sender.address, name: sender.name },
		subject,
		text,
	}
	// Only include html when provided — plain-text-only sends stay deliverability-clean.
	if (html) message.html = html
	await env.EMAIL.send(message)
}

// Fire-and-forget confirmation: a failed send must never break the join form,
// so errors only land in Workers logs.
export async function sendJoinConfirmation({ name, email }: { name: string; email: string }) {
	try {
		const content = joinConfirmationEmail({ name })
		await sendEmail({ to: email, ...content })
		console.log(`[EMAIL] join confirmation sent to ${email}`)
	} catch (err) {
		console.error('sendJoinConfirmation failed', err)
	}
}

// Directed one-to-one outreach. Sent as PLAIN TEXT on purpose: benchmarks from
// 2M+ tracked B2B emails show plain text, <90 words, one question CTA and no
// links in the first email maximise reply rates. Not for bulk sends —
// Cloudflare Email Sending is transactional; keep volumes personal.
export async function sendDirectedEmail({ to, subject, body }: { to: string; subject: string; body: string }) {
	await sendEmail({ to, subject, html: '', text: body })
}
