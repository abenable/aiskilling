// Server-only: Email Sending binding access. Importing this from client code fails the build.
import '@tanstack/react-start/server-only'
import { env } from 'cloudflare:workers'

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
	await env.EMAIL.send({
		to,
		from: { email: sender.address, name: sender.name },
		subject,
		html,
		text,
	})
}

// Fire-and-forget confirmation: a failed send must never break the join form,
// so errors only land in Workers logs.
export async function sendJoinConfirmation({ name, email }: { name: string; email: string }) {
	const firstName = name.split(' ')[0] || 'there'
	const subject = "You're in — AI Skilling"
	const text = [
		`Hi ${firstName},`,
		'',
		"Thanks for joining the AI Skilling community. We'll reach out with sessions that match what you want to learn.",
		'',
		"— AI Skilling",
	].join('\n')
	const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#f6f6f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:16px;padding:32px 24px;">
    <h1 style="margin:0 0 16px;font-size:20px;">Hi ${firstName}, you're in 🎉</h1>
    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">Thanks for joining the AI Skilling community. We&rsquo;ll reach out with sessions that match what you want to learn.</p>
    <p style="margin:0;color:#9ca3af;font-size:12px;">AI Skilling</p>
  </div>
</body>
</html>`
	try {
		await sendEmail({ to: email, subject, html, text })
		console.log(`[EMAIL] join confirmation sent to ${email}`)
	} catch (err) {
		console.error('sendJoinConfirmation failed', err)
	}
}

// Directed one-to-one outreach: plain text in, simple HTML alongside. Not for bulk sends —
// Cloudflare Email Sending is transactional; keep volumes personal.
const escapeHtml = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function sendDirectedEmail({ to, subject, body }: { to: string; subject: string; body: string }) {
	const htmlBody = escapeHtml(body).replace(/\n/g, '<br />')
	const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f6f6f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;padding:32px 24px;">
    <div style="color:#374151;font-size:15px;line-height:1.6;">${htmlBody}</div>
    <p style="margin:24px 0 0;color:#9ca3af;font-size:12px;">AI Skilling</p>
  </div>
</body>
</html>`
	await sendEmail({ to, subject, html, text: body })
}
