import { ArrowLeft, ArrowUpRight, CheckCircle, Sparkle } from '@phosphor-icons/react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Cta, Reveal, Words, easeOutExpo } from '#/components/motion'
import { Upcoming } from '#/components/upcoming'
import { activities, audiences, photo } from '#/content'
import { seo } from '#/lib/seo'
import { getUpcoming } from '#/server/functions'

export const Route = createFileRoute('/activities/$slug')({
  loader: ({ params }) => {
    const activity = activities.find((a) => a.slug === params.slug)
    if (!activity) throw notFound()
    return { activity, events: getUpcoming({ data: { kind: activity.slug } }) }
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo({ title: loaderData.activity.name, description: loaderData.activity.summary, path: `/activities/${loaderData.activity.slug}` })
      : {},
  component: ActivityPage,
})

function ActivityPage() {
  const { activity: a, events } = Route.useLoaderData()
  const frame = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: frame, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const others = activities.filter((o) => o.slug !== a.slug)

  return (
    <>
      <section className={`atmosphere tone-${a.tone} bg-canvas! pt-32 pb-20 md:pt-40`}>
        <span className="blob blob-a opacity-40" />
        <span className="blob blob-b opacity-30" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-b from-transparent to-canvas" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Link
              to="/activities"
              className="group inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={14} className="transition-transform duration-500 ease-spring group-hover:-translate-x-1" />
              All activities
            </Link>
            <h1 className="mt-6 text-display-xl">
              <Words text={a.name} />
            </h1>
            <p className="mt-6 font-display text-2xl font-medium tracking-[-0.02em] animate-[fade-up_1s_var(--ease-out-expo)_0.3s_both]" style={{ color: 'var(--tone-a)' }}>
              {a.tagline}
            </p>
            <p className="mt-4 max-w-xl text-lg text-ink-muted animate-[fade-up_1s_var(--ease-out-expo)_0.4s_both]">{a.summary}</p>
            <div className="mt-10 animate-[fade-up_1s_var(--ease-out-expo)_0.5s_both]">
              <Cta to="/join" search={{ interest: a.slug }}>
                Join the community
              </Cta>
            </div>
          </div>
          {/* CSS entrance (not Motion) so the hero photo paints before hydration. */}
          <div
            ref={frame}
            className="rounded-shell bg-white/[0.04] p-2 ring-1 ring-white/10 animate-[frame-in_1.2s_var(--ease-out-expo)_0.2s_both] lg:col-span-6"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-card shadow-[inset_0_1px_1px_rgb(255_255_255/0.1)]">
              <motion.img
                {...photo(a.slug)}
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt=""
                style={{ y: imgY, scale: 1.18 }}
                className="img-outline size-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-16 md:grid-cols-12 md:px-8 md:py-24">
        <Reveal className="md:col-span-7">
          <h2 className="text-display-md">What happens</h2>
          <ul className="mt-8 space-y-5">
            {a.happens.map((h, i) => (
              <motion.li
                key={h}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: easeOutExpo }}
                className={`tone-${a.tone} flex gap-4 text-lg`}
              >
                <Sparkle size={22} weight="fill" className="mt-0.5 shrink-0" style={{ color: 'var(--tone-a)' }} />
                {h}
              </motion.li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-5">
          <div className="h-full rounded-shell bg-white/[0.03] p-2 ring-1 ring-white/[0.08]">
            <div className="h-full rounded-card bg-surface-1 p-7 shadow-[inset_0_1px_1px_rgb(255_255_255/0.08)]">
              <h2 className="text-display-md">You’ll leave with</h2>
              <ul className="mt-6 space-y-4">
                {a.outcomes.map((o) => (
                  <li key={o} className="flex gap-3 text-ink/90">
                    <CheckCircle size={22} weight="duotone" className="shrink-0 text-success" />
                    {o}
                  </li>
                ))}
              </ul>
              <h3 className="mt-10 text-sm text-ink-faint">A good fit for</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {audiences
                  .filter((au) => (a.audiences as readonly string[]).includes(au.slug))
                  .map((au) => (
                    <Link
                      key={au.slug}
                      to="/activities"
                      search={{ audience: au.slug }}
                      className="rounded-full px-3.5 py-1.5 text-sm ring-1 ring-white/15 transition-colors hover:bg-white/[0.07]"
                    >
                      {au.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Upcoming events={events} title={`Upcoming ${a.short.toLowerCase()}`} />

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <Reveal>
          <h2 className="text-display-md">Other ways to learn</h2>
        </Reveal>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o, i) => (
            <motion.li
              key={o.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: easeOutExpo }}
            >
                <Link
                  to="/activities/$slug"
                  params={{ slug: o.slug }}
                  className={`tone-${o.tone} group flex items-center justify-between gap-4 rounded-card bg-surface-1 p-5 ring-1 ring-white/[0.08] transition-colors duration-500 hover:bg-surface-2`}
                >
                  <span>
                    <span className="block font-display text-xl font-semibold tracking-[-0.02em]">{o.short}</span>
                    <span className="mt-1 block text-sm text-ink-muted">{o.tagline}</span>
                  </span>
                  <ArrowUpRight size={18} className="shrink-0 transition-transform duration-500 ease-spring group-hover:rotate-45" style={{ color: 'var(--tone-a)' }} />
                </Link>
            </motion.li>
          ))}
        </ul>
      </section>
    </>
  )
}
