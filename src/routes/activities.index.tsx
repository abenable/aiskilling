import { ArrowUpRight, FunnelSimpleX } from '@phosphor-icons/react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Words, easeOutExpo } from '#/components/motion'
import { Upcoming } from '#/components/upcoming'
import { activities, audiences, photo } from '#/content'
import { activitiesSearch } from '#/lib/schemas'
import { seo } from '#/lib/seo'
import { getUpcoming } from '#/server/functions'

// Filters live in the URL (?type=&audience=), validated by Zod; bad values fall back to "all".
export const Route = createFileRoute('/activities/')({
  validateSearch: activitiesSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => ({
    items: activities.filter(
      (a) => (!deps.type || a.slug === deps.type) && (!deps.audience || (a.audiences as readonly string[]).includes(deps.audience)),
    ),
    events: getUpcoming({ data: { kind: deps.type } }),
  }),
  head: () =>
    seo({
      title: 'Activities',
      description: 'Workshops, meetups, bootcamps, online sessions and team training for anyone learning to use AI.',
      path: '/activities',
    }),
  component: ActivitiesPage,
})

function ActivitiesPage() {
  const { items, events } = Route.useLoaderData()
  const search = Route.useSearch()
  const typeName = activities.find((a) => a.slug === search.type)?.short

  return (
    <>
      <section className="atmosphere tone-violet bg-canvas! pt-36 pb-16 md:pt-44">
        <span className="blob blob-a opacity-35" />
        <span className="blob blob-b opacity-25" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-b from-transparent to-canvas" />
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <h1 className="text-display-xl">
            <Words text="Ways to learn" />
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-muted animate-[fade-up_1s_var(--ease-out-expo)_0.3s_both]">
            Workshops, meetups, bootcamps and more. Filter by format or by who it’s for.
          </p>

          <div className="mt-12 space-y-4 animate-[fade-up_1s_var(--ease-out-expo)_0.45s_both]">
            <ChipGroup
              label="Format"
              group="type"
              current={search.type}
              options={activities.map((a) => ({ value: a.slug, label: a.short }))}
              allLabel="All formats"
            />
            <ChipGroup
              label="For"
              group="audience"
              current={search.audience}
              options={audiences.map((a) => ({ value: a.slug, label: a.label }))}
              allLabel="Everyone"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8 md:px-8">
        <p aria-live="polite" className="mb-6 text-sm text-ink-faint">
          {items.length} {items.length === 1 ? 'format' : 'formats'}
        </p>
        <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((a, i) => (
              <motion.li
                key={a.slug}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: easeOutExpo }}
              >
                <Link
                  to="/activities/$slug"
                  params={{ slug: a.slug }}
                  className={`tone-${a.tone} group block h-full rounded-shell bg-white/[0.03] p-2 ring-1 ring-white/[0.08] transition-colors duration-500 hover:bg-white/[0.06]`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-card">
                    <img
                      {...photo(a.slug)}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      alt=""
                      loading="lazy"
                      className="img-outline size-full object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 opacity-0 mix-blend-color transition-opacity duration-700 group-hover:opacity-40"
                      style={{ background: 'linear-gradient(to top, var(--tone-a), transparent)' }}
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4 p-5">
                    <div>
                      <h2 className="font-display text-2xl font-semibold tracking-[-0.03em]">{a.name}</h2>
                      <p className="mt-1.5 text-ink-muted">{a.tagline}</p>
                    </div>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.07] transition-transform duration-500 ease-spring group-hover:rotate-45">
                      <ArrowUpRight size={16} weight="bold" />
                    </span>
                  </div>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid place-items-center rounded-shell bg-surface-1 px-6 py-20 text-center ring-1 ring-white/[0.08]"
          >
            <FunnelSimpleX size={32} className="text-ink-muted" />
            <h2 className="mt-4 text-display-md">No format matches both filters.</h2>
            <p className="mt-2 text-ink-muted">Try another combination, or see everything we run.</p>
            <Link
              to="/activities"
              resetScroll={false}
              viewTransition={false}
              className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition-transform active:scale-[0.96]"
            >
              Clear filters
            </Link>
          </motion.div>
        )}
      </section>

      <Upcoming events={events} title={typeName ? `Upcoming ${typeName.toLowerCase()}` : 'Upcoming sessions'} />
    </>
  )
}

function ChipGroup<K extends 'type' | 'audience'>({
  label,
  group,
  current,
  options,
  allLabel,
}: {
  label: string
  group: K
  current: string | undefined
  options: { value: string; label: string }[]
  allLabel: string
}) {
  const all = [{ value: undefined, label: allLabel }, ...options]
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="w-12 text-sm text-ink-faint">{label}</span>
      {all.map((o) => {
        const on = current === o.value
        return (
          <Link
            key={o.label}
            to="/activities"
            search={(prev) => ({ ...prev, [group]: o.value })}
            resetScroll={false}
            viewTransition={false}
            aria-current={on ? 'true' : undefined}
            className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-300 ${on ? 'text-canvas' : 'text-ink-muted ring-1 ring-white/10 hover:text-ink hover:ring-white/25'}`}
          >
            {on && (
              <motion.span
                layoutId={`chip-${group}`}
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
