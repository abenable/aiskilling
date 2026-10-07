import { ArrowUpRight, CheckCircle, EnvelopeSimple, Sparkle } from '@phosphor-icons/react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { AnimatePresence, motion } from 'motion/react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Words, easeOutExpo } from '#/components/motion'
import { activities, audiences, site } from '#/content'
import { joinInput, joinSearch, type JoinInput } from '#/lib/schemas'
import { seo } from '#/lib/seo'
import { joinCommunity } from '#/server/functions'

export const Route = createFileRoute('/join')({
  validateSearch: joinSearch,
  head: () =>
    seo({
      title: 'Join the community',
      description: 'Hear first about AI Skilling workshops, meetups, bootcamps and online sessions that match what you want to learn.',
      path: '/join',
    }),
  component: JoinPage,
})

type Errors = Partial<Record<keyof JoinInput, string>>

const field =
  'w-full rounded-field bg-canvas/70 px-4 py-3 text-base text-ink ring-1 ring-white/12 outline-none transition-[box-shadow,background-color] duration-300 placeholder:text-ink-faint hover:ring-white/20 focus:bg-canvas focus:ring-2 focus:ring-accent aria-invalid:ring-coral'

const perks = [
  'Hear first when new sessions are announced',
  'Invites matched to what you want to learn',
  'We only use your details to tell you about AI Skilling',
]

function JoinPage() {
  const { interest } = Route.useSearch()
  const join = useServerFn(joinCommunity)
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [serverError, setServerError] = useState('')
  const [done, setDone] = useState<{ name: string; email: string } | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const parsed = joinInput.safeParse({
      name: fd.get('name'),
      email: fd.get('email'),
      audience: fd.get('audience') ?? undefined,
      interests: fd.getAll('interests'),
      message: fd.get('message') || undefined,
      website: fd.get('website') || undefined,
    })
    if (!parsed.success) {
      const next: Errors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof JoinInput
        next[key] ??= issue.message
      }
      setErrors(next)
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus()
      return
    }
    setErrors({})
    setServerError('')
    setSending(true)
    try {
      await join({ data: parsed.data })
      setDone({ name: parsed.data.name.split(' ')[0], email: parsed.data.email })
    } catch (err) {
      setServerError(err instanceof Error && err.message.length < 200 ? err.message : 'Something went wrong on our side. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="atmosphere tone-magenta min-h-[100dvh] bg-canvas! pt-32 pb-24 md:pt-40">
      <span className="blob blob-a opacity-35" />
      <span className="blob blob-b opacity-30" />
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 md:px-8 lg:grid-cols-12">
        <div className="lg:sticky lg:top-32 lg:col-span-5">
          <h1 className="text-display-xl">
            <Words text="Join the community" />
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-muted animate-[fade-up_1s_var(--ease-out-expo)_0.3s_both]">
            Tell us a little about you. We’ll share sessions that match what you want to learn.
          </p>
          <ul className="mt-10 space-y-4">
            {perks.map((p, i) => (
              <li
                key={p}
                className="flex gap-3 text-ink/85 animate-[fade-up_0.9s_var(--ease-out-expo)_both]"
                style={{ animationDelay: `${0.45 + i * 0.08}s` }}
              >
                <Sparkle size={20} weight="fill" className="mt-0.5 shrink-0 text-coral" />
                {p}
              </li>
            ))}
          </ul>
          <a
            href={`mailto:${site.email}`}
            className="mt-10 inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ink animate-[fade-up_0.9s_var(--ease-out-expo)_0.75s_both]"
          >
            <EnvelopeSimple size={18} /> {site.email}
          </a>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-shell bg-white/[0.04] p-2 ring-1 ring-white/10 animate-[fade-up_1.1s_var(--ease-out-expo)_0.35s_both]">
            <div className="overflow-hidden rounded-card bg-surface-1/95 shadow-[inset_0_1px_1px_rgb(255_255_255/0.08)]">
              <AnimatePresence mode="wait" initial={false}>
                {done ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: easeOutExpo }}
                    className="px-6 py-16 text-center md:px-12 md:py-24"
                    role="status"
                  >
                    <motion.span
                      initial={{ scale: 0.25, opacity: 0, filter: 'blur(4px)' }}
                      animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                      transition={{ type: 'spring', duration: 0.6, bounce: 0, delay: 0.15 }}
                      className="mx-auto grid size-20 place-items-center rounded-full bg-success/15 text-success ring-1 ring-success/30"
                    >
                      <CheckCircle size={40} weight="fill" />
                    </motion.span>
                    <h2 className="mt-8 text-display-md">You’re on the list, {done.name}.</h2>
                    <p className="mx-auto mt-3 max-w-md text-ink-muted">
                      We’ll write to <span className="text-ink">{done.email}</span> when there’s a session that fits.
                    </p>
                    <Link
                      to="/activities"
                      className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/[0.12]"
                    >
                      Explore activities
                      <ArrowUpRight size={14} weight="bold" className="transition-transform duration-500 ease-spring group-hover:rotate-45" />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.form
                    key={`form-${interest ?? 'any'}`}
                    exit={{ opacity: 0, y: -16, transition: { duration: 0.25 } }}
                    onSubmit={onSubmit}
                    noValidate
                    className="space-y-7 p-6 md:p-10"
                  >
                    <div className="grid gap-7 sm:grid-cols-2">
                      <Field label="Your name" id="name" error={errors.name}>
                        <input id="name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} className={field} />
                      </Field>
                      <Field label="Email" id="email" error={errors.email}>
                        <input id="email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} className={field} />
                      </Field>
                    </div>

                    <Chips legend="Which best describes you?" error={errors.audience} name="audience">
                      {audiences.map((a) => (
                        <Chip key={a.slug} type="radio" name="audience" value={a.slug} label={a.name} invalid={!!errors.audience} />
                      ))}
                    </Chips>

                    <Chips legend="What would you like to join?" hint="Pick as many as you like." error={errors.interests} name="interests">
                      {activities.map((a) => (
                        <Chip key={a.slug} type="checkbox" name="interests" value={a.slug} label={a.short} defaultChecked={a.slug === interest} invalid={!!errors.interests} />
                      ))}
                    </Chips>

                    <Field label="Anything you’d like to learn?" hint="Optional" id="message" error={errors.message}>
                      <textarea id="message" name="message" rows={4} placeholder="For example: using AI to plan lessons, or to make sense of sales data." aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} className={`${field} resize-y`} />
                    </Field>

                    {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
                    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                      <label htmlFor="website">Website</label>
                      <input id="website" name="website" tabIndex={-1} autoComplete="off" />
                    </div>

                    <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                      <p aria-live="polite" className="text-sm text-coral">
                        {serverError}
                      </p>
                      <button
                        type="submit"
                        disabled={sending}
                        className="group inline-flex items-center justify-center gap-3 self-start rounded-full bg-ink py-1.5 pr-1.5 pl-6 text-[15px] font-medium whitespace-nowrap text-canvas shadow-[0_8px_30px_-8px_rgb(255_255_255/0.35)] transition-[scale,opacity] duration-300 ease-out-expo active:scale-[0.96] disabled:opacity-70 sm:self-auto"
                      >
                        {sending ? 'Sending…' : 'Join the community'}
                        <span className="grid size-9 place-items-center rounded-full bg-canvas text-ink transition-transform duration-500 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-px">
                          <ArrowUpRight size={16} weight="bold" className={sending ? 'animate-spin' : 'transition-transform duration-500 ease-spring group-hover:rotate-45'} />
                        </span>
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, hint, id, error, children }: { label: string; hint?: string; id: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-medium">
        {label}
        {hint && <span className="font-normal text-ink-faint">{hint}</span>}
      </label>
      {children}
      <ErrorText id={`${id}-error`} error={error} />
    </div>
  )
}

function Chips({ legend, hint, name, error, children }: { legend: string; hint?: string; name: string; error?: string; children: ReactNode }) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="flex w-full items-baseline justify-between text-sm font-medium">
        {legend}
        {hint && <span className="font-normal text-ink-faint">{hint}</span>}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
      <ErrorText id={`${name}-error`} error={error} />
    </fieldset>
  )
}

function Chip({ type, name, value, label, defaultChecked, invalid }: { type: 'radio' | 'checkbox'; name: string; value: string; label: string; defaultChecked?: boolean; invalid: boolean }) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} value={value} defaultChecked={defaultChecked} className="peer sr-only" />
      <span
        className={`inline-flex items-center rounded-full px-4 py-2.5 text-sm ring-1 transition-[background-color,color,box-shadow,scale] duration-300 ease-out-expo select-none peer-checked:bg-ink peer-checked:text-canvas peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accent active:scale-[0.96] ${invalid ? 'text-ink ring-coral' : 'text-ink-muted ring-white/15 hover:text-ink hover:ring-white/30'}`}
      >
        {label}
      </span>
    </label>
  )
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          id={id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-1 text-sm text-coral"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
