import { ArrowUpRight, CalendarBlank, MapPin } from '@phosphor-icons/react'
import { Await, Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { activities, site } from '#/content'
import type { EventItem } from '#/lib/schemas'
import { Cta, Reveal, easeOutExpo } from './motion'

// Dates are shown as written in D1 (venue-local wall time), identically on server and client.
function when(startsAt: string) {
  const [date, time = '00:00'] = startsAt.split('T')
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.slice(0, 5).split(':').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d, hh, mm))
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en', { timeZone: 'UTC', ...o }).format(dt)
  return { day: f({ day: 'numeric' }), month: f({ month: 'short' }), weekday: f({ weekday: 'long' }), time: f({ hour: 'numeric', minute: '2-digit' }) }
}

/** Streams in after the page shell: the promise comes un-awaited from the route loader. */
export function Upcoming({ events, title = 'Upcoming sessions' }: { events: Promise<EventItem[]>; title?: string }) {
  return (
    <section id="upcoming" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <h2 className="text-display-lg">{title}</h2>
      </Reveal>
      <div className="mt-12">
        <Await promise={events} fallback={<Skeleton />}>
          {(list) => (list.length ? <List events={list} /> : <Empty />)}
        </Await>
      </div>
    </section>
  )
}

/** Event structured data so sessions can appear as event listings in Google. */
function eventsJsonLd(events: EventItem[]) {
  const json = events.map((e) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    startDate: e.startsAt,
    description: e.summary || undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: `https://schema.org/${e.kind === 'online' ? 'Online' : 'Offline'}EventAttendanceMode`,
    location:
      e.kind === 'online'
        ? { '@type': 'VirtualLocation', url: e.url ?? `${site.url}/join` }
        : { '@type': 'Place', name: e.location, address: e.location },
    image: `${site.url}/images/${e.kind}-1600.webp`,
    url: e.url ?? `${site.url}/activities/${e.kind}`,
    organizer: { '@type': 'Organization', name: site.name, url: site.url },
  }))
  // Escape "<" so text from the database can never close the script tag.
  return JSON.stringify(json).replace(/</g, '\\u003c')
}

function List({ events }: { events: EventItem[] }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: eventsJsonLd(events) }} />
      <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
        {events.map((e, i) => {
          const w = when(e.startsAt)
          const activity = activities.find((a) => a.slug === e.kind)
          return (
            <motion.li
              key={e.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.07, ease: easeOutExpo }}
              className="group grid grid-cols-[4.5rem_1fr] items-center gap-x-6 gap-y-3 py-6 md:grid-cols-[6rem_1fr_auto]"
            >
              <div className={`tone-${activity?.tone ?? 'blue'} text-center`}>
                <p className="font-display text-5xl leading-none font-semibold tracking-tight" style={{ color: 'var(--tone-a)' }}>
                  {w.day}
                </p>
                <p className="mt-1 text-sm text-ink-muted uppercase">{w.month}</p>
              </div>
              <div>
                <p className="text-sm text-ink-faint">
                  {activity?.short ?? e.kind} · {w.weekday}, {w.time}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em]">{e.title}</h3>
                <p className="mt-1.5 flex items-center gap-1.5 text-ink-muted">
                  <MapPin size={16} /> {e.location}
                </p>
                {e.summary && <p className="mt-2 max-w-2xl text-ink-muted">{e.summary}</p>}
              </div>
              <div className="col-start-2 md:col-start-auto">
                {e.url ? (
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/[0.12]"
                  >
                    Reserve a seat <ArrowUpRight size={14} weight="bold" />
                  </a>
                ) : (
                  <Link
                    to="/join"
                    search={{ interest: e.kind }}
                    className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/[0.12]"
                  >
                    Reserve a seat <ArrowUpRight size={14} weight="bold" />
                  </Link>
                )}
              </div>
            </motion.li>
          )
        })}
      </ul>
    </>
  )
}

function Empty() {
  return (
    <Reveal>
      <div className="atmosphere tone-blue grid gap-8 rounded-shell px-6 py-14 md:grid-cols-[auto_1fr_auto] md:items-center md:px-12">
        <span className="blob blob-a opacity-50" />
        <span className="blob blob-b opacity-40" />
        <span className="grid size-16 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
          <CalendarBlank size={28} />
        </span>
        <div>
          <h3 className="text-display-md">New dates are on the way.</h3>
          <p className="mt-2 max-w-xl text-ink-muted">
            Join the community and you’ll hear as soon as the next session is announced.
          </p>
        </div>
        <Cta to="/join">Join the community</Cta>
      </div>
    </Reveal>
  )
}

function Skeleton() {
  return (
    <ul aria-busy="true" aria-label="Loading sessions" className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
      {[0, 1, 2].map((i) => (
        <li key={i} className="grid grid-cols-[4.5rem_1fr] items-center gap-6 py-6 md:grid-cols-[6rem_1fr]">
          <div className="mx-auto h-14 w-12 animate-pulse rounded-lg bg-white/[0.06]" />
          <div className="space-y-3">
            <div className="h-3 w-40 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-6 w-2/3 animate-pulse rounded bg-white/[0.08]" />
            <div className="h-3 w-32 animate-pulse rounded bg-white/[0.06]" />
          </div>
        </li>
      ))}
    </ul>
  )
}
