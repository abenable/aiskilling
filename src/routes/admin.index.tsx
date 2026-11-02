import { ArrowDown, ArrowUp, ArrowsDownUp, Check, Copy, DownloadSimple, EnvelopeSimple, PaperPlaneTilt, X } from '@phosphor-icons/react'
import { Link, createFileRoute, type ErrorComponentProps } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useEffect, useState, type FormEvent } from 'react'
import { easeOutExpo } from '#/components/motion'
import { outreachStarters } from '#/lib/email-templates'
import { adminSearch, groupName, interestNames, type AdminSearch, type Signup, type SignupSort } from '#/lib/signups'

export const Route = createFileRoute('/admin/')({
  // Client-only: private data with no SEO value. It loads through the password-protected /admin API,
  // which the browser authenticates automatically after the login box on first visit.
  ssr: false,
  validateSearch: adminSearch,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const res = await fetch(`/admin/api/signups?${new URLSearchParams(deps)}`)
    if (!res.ok) {
      throw new Error(res.status === 401 ? 'Your login has expired. Reload the page to log in again.' : `Could not load sign-ups (error ${res.status}).`)
    }
    return (await res.json()) as Signup[]
  },
  head: () => ({ meta: [{ title: 'Sign-ups | AI Skilling' }, { name: 'robots', content: 'noindex, nofollow' }] }),
  pendingComponent: () => <Shell>{null}</Shell>,
  errorComponent: AdminError,
  component: AdminPage,
})

// Sign-up times are stored in UTC; show them in Kampala time.
const joined = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Kampala', dateStyle: 'medium', timeStyle: 'short' })
const formatJoined = (utc: string) => joined.format(new Date(utc.replace(' ', 'T') + 'Z'))

const columns: { label: string; sort?: SignupSort }[] = [
  { label: 'Name', sort: 'name' },
  { label: 'Email', sort: 'email' },
  { label: 'Group', sort: 'group' },
  { label: 'Interests' },
  { label: 'Message' },
  { label: 'Joined', sort: 'joined' },
]

function AdminPage() {
  const rows = Route.useLoaderData()
  const search = Route.useSearch()
  const [compose, setCompose] = useState<ComposeTarget | null>(null)
  return (
    <Shell count={rows.length} search={search} emails={rows.map((r) => r.email)}>
      {rows.length ? (
        <div className="overflow-x-auto rounded-card bg-surface-1 shadow-[inset_0_1px_1px_rgb(255_255_255/0.08)]">
          <table className="w-full min-w-[60rem] text-left text-sm">
            <thead className="border-b border-white/[0.08] text-ink-muted">
              <tr>
                {columns.map((c) =>
                  c.sort ? (
                    <SortHeader key={c.label} label={c.label} col={c.sort} search={search} />
                  ) : (
                    <th key={c.label} scope="col" className="px-4 py-3.5 font-medium">
                      {c.label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                // layout: rows glide to their new positions when the sort changes.
                <motion.tr key={r.id} layout transition={{ duration: 0.5, ease: easeOutExpo }} className="border-b border-white/[0.06] align-top last:border-0">
                  <td className="px-4 py-3.5 font-medium">{r.name}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <a href={`mailto:${r.email}`} className="text-ink underline decoration-white/25 underline-offset-4 hover:decoration-white">
                        {r.email}
                      </a>
                      <button
                        type="button"
                        onClick={() => setCompose({ id: r.id, name: r.name, email: r.email })}
                        aria-label={`Email ${r.name}`}
                        title={`Email ${r.name}`}
                        className="inline-flex shrink-0 items-center rounded-full bg-white/[0.07] p-1.5 ring-1 ring-white/10 transition-[background-color,scale] duration-300 ease-out-expo hover:bg-white/[0.12] active:scale-[0.94]"
                      >
                        <EnvelopeSimple size={13} weight="bold" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-ink-muted">{groupName(r.audience)}</td>
                  <td className="px-4 py-3.5 text-ink-muted">{interestNames(r.interests).join(', ')}</td>
                  <td className="max-w-xs px-4 py-3.5 whitespace-pre-line text-ink-muted">{r.message ?? ''}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-ink-muted tabular-nums">{formatJoined(r.createdAt)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-card bg-surface-1 px-6 py-16 text-center shadow-[inset_0_1px_1px_rgb(255_255_255/0.08)]">
          <h2 className="text-display-md">No sign-ups yet.</h2>
          <p className="mt-2 text-ink-muted">They’ll show up here as soon as someone joins through the website.</p>
        </div>
      )}
      <EmailComposer target={compose} onClose={() => setCompose(null)} />
    </Shell>
  )
}

/** Page frame shared by the loaded, loading and error states. */
function Shell({ count, search, emails = [], children }: { count?: number; search?: AdminSearch; emails?: string[]; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-32 pb-24 md:px-8 md:pt-40">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-display-lg">Sign-ups</h1>
          <p className="mt-3 text-ink-muted">
            {count === undefined ? 'Loading…' : `${count} ${count === 1 ? 'person has' : 'people have'} joined through the website.`}
          </p>
        </div>
        {search && (
          <div className="flex flex-wrap gap-2">
            <CopyEmails emails={emails} />
            <a
              href={`/admin/signups.csv?${new URLSearchParams(search)}`}
              download
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition-[scale] duration-300 ease-out-expo active:scale-[0.96]"
            >
              <DownloadSimple size={16} weight="bold" /> Download CSV
            </a>
          </div>
        )}
      </div>
      <div className="mt-10 rounded-shell bg-white/[0.03] p-2 ring-1 ring-white/[0.08]">{children}</div>
    </section>
  )
}

/** Directed one-to-one email from the admin composer, sent via the EMAIL binding and logged in D1. */
type ComposeTarget = { id: number; name: string; email: string }

function EmailComposer({ target, onClose }: { target: ComposeTarget | null; onClose: () => void }) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [starter, setStarter] = useState('')

  // Reset the draft whenever a new person is targeted.
  useEffect(() => {
    setSubject('')
    setBody('')
    setError('')
    setSent(false)
    setSending(false)
    setStarter('')
  }, [target?.email])

  useEffect(() => {
    if (!target) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [target, onClose])

  if (!target) return null

  async function send(e: FormEvent) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch('/admin/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signupId: target!.id, to: target!.email, subject, body }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error ?? `Sending failed (error ${res.status}).`)
      }
      setSent(true)
      setTimeout(onClose, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5" role="dialog" aria-modal="true" aria-label={`Email ${target.name}`}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg rounded-card bg-surface-1 p-6 shadow-2xl ring-1 ring-white/10">
        {sent ? (
          <div className="px-2 py-10 text-center">
            <Check size={40} weight="bold" className="mx-auto text-success" />
            <p className="mt-4 text-lg">Sent to {target.email}.</p>
            <p className="mt-1 text-sm text-ink-muted">A record is kept in the sent_emails table.</p>
          </div>
        ) : (
          <form onSubmit={send}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-display-md">Email {target.name}</h2>
                <p className="mt-1 text-sm text-ink-muted">From no-reply@aiskilling.dev, one person at a time.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full bg-white/[0.07] p-2 ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/[0.12]"
              >
                <X size={14} weight="bold" />
              </button>
            </div>
            <div className="mt-5 space-y-3">
              <select
                value={starter}
                onChange={(e) => {
                  setStarter(e.target.value)
                  const s = outreachStarters.find((t) => t.label === e.target.value)
                  if (s) {
                    setSubject(s.subject)
                    setBody(s.body.replaceAll('[Company]', target.name.split(' ')[0] ? target.name : '[Company]'))
                  }
                }}
                className="w-full rounded-xl bg-white/[0.05] px-4 py-3 text-sm text-ink ring-1 ring-white/10 transition-[box-shadow] duration-300 focus:ring-white/25 focus:outline-none"
                aria-label="Start from a proven outreach template"
              >
                <option value="">Start from scratch…</option>
                {outreachStarters.map((t) => (
                  <option key={t.label} value={t.label}>
                    {t.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                maxLength={200}
                required
                className="w-full rounded-xl bg-white/[0.05] px-4 py-3 text-sm text-ink ring-1 ring-white/10 transition-[box-shadow] duration-300 placeholder:text-ink-muted/60 focus:ring-white/25 focus:outline-none"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={`Hi ${target.name.split(' ')[0]}, …`}
                rows={10}
                maxLength={5000}
                required
                className="w-full resize-y rounded-xl bg-white/[0.05] px-4 py-3 text-sm text-ink ring-1 ring-white/10 transition-[box-shadow] duration-300 placeholder:text-ink-muted/60 focus:ring-white/25 focus:outline-none"
              />
              <p className="text-xs text-ink-muted">
                Sent as plain text — best reply rates come from under 90 words, a personalised first line, and one question at the end.
              </p>
            </div>
            {error && <p className="mt-3 text-sm text-danger">{error}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white/[0.07] px-5 py-2.5 text-sm font-medium ring-1 ring-white/10 transition-[background-color,scale] duration-300 ease-out-expo hover:bg-white/[0.12] active:scale-[0.96]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition-[scale] duration-300 ease-out-expo active:scale-[0.96] disabled:opacity-50"
              >
                <PaperPlaneTilt size={16} weight="bold" />
                <span aria-live="polite">{sending ? 'Sending…' : 'Send'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function SortHeader({ label, col, search }: { label: string; col: SignupSort; search: AdminSearch }) {
  const active = search.sort === col
  // A new column starts newest-first for dates and A to Z for text; clicking the active column flips it.
  const dir = active ? (search.dir === 'asc' ? 'desc' : 'asc') : col === 'joined' ? 'desc' : 'asc'
  const Icon = !active ? ArrowsDownUp : search.dir === 'asc' ? ArrowUp : ArrowDown
  return (
    <th scope="col" aria-sort={active ? (search.dir === 'asc' ? 'ascending' : 'descending') : 'none'} className="px-4 py-3.5 font-medium">
      <Link
        to="/admin"
        search={{ sort: col, dir }}
        replace
        resetScroll={false}
        viewTransition={false}
        className={`inline-flex items-center gap-1.5 transition-colors hover:text-ink ${active ? 'text-ink' : ''}`}
      >
        {label}
        <Icon size={14} weight={active ? 'bold' : 'regular'} className={active ? '' : 'opacity-50'} />
      </Link>
    </th>
  )
}

function CopyEmails({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(emails.join(', '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      type="button"
      onClick={copy}
      disabled={!emails.length}
      className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-5 py-2.5 text-sm font-medium ring-1 ring-white/10 transition-[background-color,scale] duration-300 ease-out-expo hover:bg-white/[0.12] active:scale-[0.96] disabled:opacity-50"
    >
      {copied ? <Check size={16} weight="bold" className="text-success" /> : <Copy size={16} />}
      <span aria-live="polite">{copied ? `Copied ${emails.length} emails` : 'Copy all emails'}</span>
    </button>
  )
}

function AdminError({ error }: ErrorComponentProps) {
  return (
    <Shell>
      <div className="rounded-card bg-surface-1 px-6 py-16 text-center">
        <p className="text-lg">{error instanceof Error ? error.message : 'Something went wrong.'}</p>
        <button type="button" onClick={() => location.reload()} className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas">
          Reload
        </button>
      </div>
    </Shell>
  )
}
