import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  CalendarCheck,
  ChatCircleText,
  FlowArrow,
  ImagesSquare,
  Laptop,
  PenNib,
  Plant,
  ShieldCheck,
  Table,
  UserPlus,
} from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { activities, audiences, bootcamp, manifesto, photo, site, skills, steps, tools, type Tone } from '#/content'
import { Cta, Reveal, easeOutExpo, spotlight } from '../motion'

export function ToolsStrip() {
  return (
    <section aria-labelledby="tools-title" className="mx-auto max-w-7xl px-5 pt-10 pb-6 md:px-8">
      <h2 id="tools-title" className="text-center font-sans text-sm font-normal text-ink-faint">
        Tools you’ll get hands-on with
      </h2>
      <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-6">
        {tools.map((t, i) => (
          <motion.li
            key={t.slug}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: (i % 6) * 0.05 + Math.floor(i / 6) * 0.1, ease: easeOutExpo }}
            className="flex items-center justify-center gap-2.5 text-ink-muted transition-colors duration-300 hover:text-ink"
          >
            <img src={`/logos/${t.slug}.svg`} alt="" width={20} height={20} className="size-5 opacity-80" />
            <span className="text-[15px] font-medium">{t.name}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

/** Words light up as the paragraph scrolls through the viewport. */
export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = manifesto.split(' ')
  return (
    <section className="mx-auto max-w-6xl px-5 py-28 md:px-8 md:py-44">
      <p ref={ref} className="font-display text-[clamp(1.75rem,4.2vw,3.6rem)] leading-[1.12] font-medium tracking-[-0.035em]">
        {words.map((w, i) => (
          <LitWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={/hands-on|real/.test(w)}>
            {w}
          </LitWord>
        ))}
      </p>
    </section>
  )
}

function LitWord({ children, progress, range, accent }: { children: string; progress: MotionValue<number>; range: [number, number]; accent: boolean }) {
  const opacity = useTransform(progress, range, [0.13, 1])
  return (
    <motion.span style={{ opacity }} className={accent ? 'text-coral' : undefined}>
      {children}{' '}
    </motion.span>
  )
}

/** Accordion of photo panels: hover or focus one to open it. Stacks open on mobile. */
export function Audiences() {
  const [active, setActive] = useState(0)
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <h2 className="max-w-3xl text-display-lg">Built for wherever you’re starting from.</h2>
      </Reveal>
      <Reveal delay={0.1} className="mt-12">
        <ul className="flex flex-col gap-3 md:h-[34rem] md:flex-row">
          {audiences.map((a, i) => {
            const on = i === active
            return (
              <li
                key={a.slug}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`tone-${a.tone} relative h-[26rem] overflow-hidden rounded-card ring-1 ring-white/[0.08] transition-[flex-grow] duration-700 ease-spring md:h-auto md:basis-0 ${on ? 'md:grow-[3]' : 'md:grow'}`}
              >
                <img
                  {...photo(a.slug)}
                  sizes="(min-width: 768px) 55vw, 100vw"
                  alt=""
                  loading="lazy"
                  className={`absolute inset-0 size-full object-cover transition-[scale,filter] duration-1000 ease-out-expo ${on ? 'scale-100' : 'scale-110 md:grayscale-[0.7]'}`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-canvas via-canvas/50 to-canvas/0" />
                <div
                  className={`absolute inset-0 mix-blend-color transition-opacity duration-700 ${on ? 'opacity-35' : 'opacity-0'}`}
                  style={{ background: 'linear-gradient(to top, var(--tone-a), transparent 70%)' }}
                />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                  <h3 className="font-display text-[1.6rem] font-semibold tracking-[-0.03em] whitespace-nowrap">{a.label}</h3>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-700 ease-spring ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[1fr] md:grid-rows-[0fr] md:opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-2 max-w-md text-ink/80">{a.line}</p>
                      <Link
                        to="/activities"
                        search={{ audience: a.slug }}
                        className="group mt-5 inline-flex items-center gap-2 text-sm font-medium"
                      >
                        Explore activities
                        <ArrowRight size={14} weight="bold" className="transition-transform duration-500 ease-spring group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </Reveal>
    </section>
  )
}

const bento: Record<string, string> = {
  workshops: 'md:col-span-4 md:row-span-2',
  meetups: 'md:col-span-2',
  online: 'md:col-span-2',
  bootcamps: 'md:col-span-3',
  'team-training': 'md:col-span-3',
}
const bentoOrder = ['workshops', 'meetups', 'online', 'bootcamps', 'team-training']

export function Formats() {
  const items = bentoOrder.map((s) => activities.find((a) => a.slug === s)!)
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <h2 className="max-w-3xl text-display-lg">Pick the format that fits you.</h2>
      </Reveal>
      <div className="mt-12 grid gap-3 md:auto-rows-[16rem] md:grid-cols-6">
        {items.map((a, i) => (
          <Reveal key={a.slug} delay={i * 0.06} className={`${bento[a.slug]} min-h-[17rem]`}>
            <Link
              to="/activities/$slug"
              params={{ slug: a.slug }}
              onPointerMove={spotlight}
              className={`spotlight tone-${a.tone} group relative isolate flex h-full flex-col justify-end overflow-hidden rounded-card p-6 ring-1 ring-white/[0.08] md:p-7`}
            >
              <img
                {...photo(a.slug)}
                sizes={a.slug === 'workshops' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 50vw, 100vw'}
                alt=""
                loading="lazy"
                className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-linear-to-t from-canvas/95 via-canvas/40 to-canvas/0" />
              <span className="absolute top-5 right-5 grid size-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-md transition-transform duration-500 ease-spring group-hover:rotate-45 group-hover:scale-110">
                <ArrowUpRight size={16} weight="bold" />
              </span>
              <h3 className={`font-semibold tracking-[-0.03em] ${a.slug === 'workshops' ? 'text-display-lg' : 'font-display text-[1.9rem] leading-tight'}`}>
                {a.name}
              </h3>
              <p className="mt-2 max-w-sm text-ink/80">{a.tagline}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const skillIcons = { chat: ChatCircleText, book: BookOpenText, pen: PenNib, table: Table, image: ImagesSquare, flow: FlowArrow, shield: ShieldCheck }
const skillTones: Tone[] = ['coral', 'magenta', 'violet', 'blue', 'orange', 'coral', 'magenta']

/** Vertical scroll drives a horizontal pan on desktop; native swipe on mobile and for reduced motion. */
export function Skills() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const reduce = useReducedMotion()
  const distance = useMotionValue(0)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(() => (reduce ? 0 : -scrollYProgress.get() * distance.get()))

  useEffect(() => {
    const el = track.current
    if (!el) return
    const wide = window.matchMedia('(min-width: 768px)')
    const measure = () => distance.set(wide.matches ? Math.max(0, el.scrollWidth - el.clientWidth) : 0)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    wide.addEventListener('change', measure)
    return () => {
      ro.disconnect()
      wide.removeEventListener('change', measure)
    }
  }, [distance])

  return (
    <section ref={section} className="relative md:motion-safe:h-[320vh]">
      <div className="flex flex-col justify-center overflow-hidden py-20 md:motion-safe:sticky md:motion-safe:top-0 md:motion-safe:h-[100dvh] md:motion-safe:py-0">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
          <p className="text-sm font-medium tracking-[0.18em] text-ink-faint uppercase">Practical skills</p>
          <h2 className="mt-4 max-w-3xl text-display-lg">What you’ll learn to do.</h2>
        </div>
        <motion.ul
          ref={track}
          style={{ x }}
          className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:snap-none md:px-[max(2rem,calc((100vw-80rem)/2+2rem))] md:motion-safe:overflow-visible"
        >
          {skills.map((s, i) => {
            const Icon = skillIcons[s.icon]
            return (
              <li key={s.title} className={`tone-${skillTones[i]} group shrink-0 snap-start`}>
                <div className="h-[24rem] w-[min(78vw,22rem)] rounded-shell bg-white/[0.03] p-2 ring-1 ring-white/[0.08] md:h-[27rem] md:w-[24rem]">
                  <div className="relative isolate flex h-full flex-col justify-between overflow-hidden rounded-card bg-surface-1 p-7 shadow-[inset_0_1px_1px_rgb(255_255_255/0.08)]">
                    <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-3/5 overflow-hidden">
                      <img
                        {...photo(`skill-${s.icon}`)}
                        sizes="(min-width: 768px) 24rem, 78vw"
                        alt=""
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
                      />
                      <div
                        className="absolute inset-0 opacity-30 mix-blend-color"
                        style={{ background: 'linear-gradient(to top, var(--tone-a), transparent 80%)' }}
                      />
                      <div className="absolute inset-0 bg-linear-to-b from-surface-1/10 via-surface-1/30 to-surface-1" />
                    </div>
                    <span
                      className="relative grid size-14 place-items-center rounded-2xl text-canvas shadow-[0_8px_24px_-6px_rgb(0_0_0/0.5)]"
                      style={{ background: 'linear-gradient(135deg, var(--tone-a), var(--tone-b))' }}
                    >
                      <Icon size={26} weight="duotone" />
                    </span>
                    <div className="relative">
                      <h3 className="font-display text-[1.9rem] leading-tight font-semibold tracking-[-0.03em]">{s.title}</h3>
                      <p className="mt-3 text-ink-muted">{s.body}</p>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </motion.ul>
        <div className="mx-auto mt-10 hidden w-full max-w-7xl px-8 md:motion-safe:block">
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="h-px origin-left bg-linear-to-r from-coral via-magenta to-violet"
          />
        </div>
      </div>
    </section>
  )
}

const stepIcons = [UserPlus, CalendarCheck, Laptop, Plant]

/** Sticky title beside a rail that fills as you read down the steps. */
export function Journey() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] })
  return (
    <section id="how" className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-12 md:px-8 md:py-32">
      <div className="self-start md:sticky md:top-32 md:col-span-5">
        <Reveal>
          <h2 className="text-display-lg">How it works</h2>
          <p className="mt-5 max-w-sm text-lg text-ink-muted">From curious to confident, at your own pace.</p>
        </Reveal>
      </div>
      <ol ref={ref} className="relative md:col-span-7">
        <span aria-hidden className="absolute top-3 bottom-3 left-[23px] w-px bg-white/10" />
        <motion.span
          aria-hidden
          style={{ scaleY: scrollYProgress }}
          className="absolute top-3 bottom-3 left-[23px] w-px origin-top bg-linear-to-b from-coral via-magenta to-violet"
        />
        {steps.map((s, i) => (
          <Step key={s.title} i={i} title={s.title} body={s.body} progress={scrollYProgress} />
        ))}
      </ol>
    </section>
  )
}

function Step({ i, title, body, progress }: { i: number; title: string; body: string; progress: MotionValue<number> }) {
  const at = i / steps.length
  const lit = useTransform(progress, [at, at + 0.08], [0, 1])
  const Icon = stepIcons[i]
  return (
    <li className="relative pb-16 pl-20 last:pb-0">
      <span className="absolute top-0 left-0 grid size-12 place-items-center rounded-full bg-surface-2 text-ink-muted ring-1 ring-white/10">
        <Icon size={20} />
        <motion.span
          style={{ opacity: lit, scale: lit }}
          className="absolute inset-0 grid place-items-center rounded-full bg-linear-to-br from-coral to-magenta text-canvas"
        >
          <Icon size={20} weight="bold" />
        </motion.span>
      </span>
      <Reveal>
        <h3 className="pt-1.5 text-display-md">{title}</h3>
        <p className="mt-3 max-w-md text-lg text-ink-muted">{body}</p>
      </Reveal>
    </li>
  )
}

const galleryCells = ['col-span-2 md:col-span-4 md:row-span-2', 'md:col-span-2', 'md:col-span-2', 'md:col-span-2', 'md:col-span-2', 'col-span-2 md:col-span-2']

/** Real photos from the last bootcamp: each one settles from a slight zoom as it scrolls in. */
export function Gallery() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <h2 className="max-w-3xl text-display-lg">Inside our last bootcamp.</h2>
        <p className="mt-5 max-w-xl text-lg text-ink-muted">
          {bootcamp.when}: group work on laptops, team pitches, and certificates to finish.
        </p>
      </Reveal>
      <ul className="mt-12 grid grid-cols-2 gap-3 md:auto-rows-[15rem] md:grid-cols-6">
        {bootcamp.photos.map((p, i) => (
          <motion.li
            key={p.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: (i % 3) * 0.08, ease: easeOutExpo }}
            className={`relative aspect-[4/3] overflow-hidden rounded-card ring-1 ring-white/[0.08] md:aspect-auto ${galleryCells[i]}`}
          >
            <motion.img
              {...photo(p.name)}
              sizes={i === 0 ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 50vw'}
              alt={p.alt}
              loading="lazy"
              initial={{ scale: 1.15 }}
              whileInView={{ scale: 1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.8, ease: easeOutExpo } }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: easeOutExpo }}
              className="size-full object-cover"
            />
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

export function Closing() {
  return (
    <section className="px-4 pb-24 md:px-8">
      <div className="atmosphere tone-coral mx-auto max-w-7xl rounded-shell px-6 py-24 text-center md:py-36">
        <img
          {...photo('crowd')}
          sizes="100vw"
          alt=""
          loading="lazy"
          className="absolute inset-0 -z-20 size-full object-cover opacity-25 mix-blend-luminosity"
        />
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
        <div aria-hidden className="absolute inset-0 -z-[5] bg-canvas/35" />
        <Reveal>
          <h2 className="mx-auto max-w-4xl text-display-xl">Start with one session.</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink/85">
            Tell us who you are and what you want to learn. We’ll let you know when there’s a session that fits.
          </p>
          <div className="mt-10 flex justify-center">
            <Cta to="/join">Join the community</Cta>
          </div>
          <p className="mt-8 text-sm text-ink/70">
            Prefer email?{' '}
            <a href={`mailto:${site.email}`} className="text-ink underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white">
              {site.email}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
