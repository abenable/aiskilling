import { Sparkle } from '@phosphor-icons/react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { audiences, prompts } from '#/content'
import { Cta, Words, easeOutExpo } from '../motion'

export function Hero() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI((n) => (n + 1) % audiences.length), 2800)
    return () => clearInterval(t)
  }, [reduce])
  const a = audiences[i]

  // Soft light that trails the cursor, tinted by the current audience tone.
  const mx = useMotionValue(-999)
  const my = useMotionValue(-999)
  const sx = useSpring(mx, { stiffness: 70, damping: 18 })
  const sy = useSpring(my, { stiffness: 70, damping: 18 })
  const glow = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, color-mix(in oklab, var(--tone-a) 28%, transparent), transparent 70%)`

  return (
    <section
      className={`atmosphere tone-${a.tone} min-h-[100dvh] bg-canvas!`}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set(e.clientX - r.left)
        my.set(e.clientY - r.top)
      }}
    >
      <span className="blob blob-a opacity-45" />
      <span className="blob blob-b opacity-40" />
      <span className="blob blob-c opacity-30!" />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: glow }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-b from-transparent to-canvas" />

      <div className="mx-auto grid min-h-[100dvh] max-w-7xl items-center gap-x-8 gap-y-12 px-5 pt-32 pb-16 md:px-8 lg:grid-cols-12 lg:pt-24">
        <div className="lg:col-span-8">
          <h1 className="text-display-xl">
            <span className="sr-only">Put AI to work for your studies, career, ideas and business.</span>
            <span aria-hidden className="block">
              <Words text="Put AI to work" />
            </span>
            <span aria-hidden className="block whitespace-nowrap">
              <Words text="for your" delay={0.28} />
              <span className="relative inline-flex overflow-hidden pb-[0.12em] -mb-[0.12em] align-top animate-[word-in_1.1s_var(--ease-out-expo)_0.42s_both]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={a.word}
                    className="inline-block"
                    style={{ color: 'var(--tone-a)' }}
                    initial={{ y: '90%', opacity: 0, filter: 'blur(10px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: '-90%', opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 0.8, ease: easeOutExpo }}
                  >
                    {a.word}.
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </h1>
          <p className="mt-7 max-w-[34rem] text-lg leading-relaxed text-ink-muted animate-[fade-up_1s_var(--ease-out-expo)_0.6s_both] md:text-xl">
            Hands-on workshops, meetups and bootcamps that turn AI curiosity into skills you use every day.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 animate-[fade-up_1s_var(--ease-out-expo)_0.75s_both]">
            <Cta to="/join">Join the community</Cta>
            <Cta to="/activities" variant="ghost">
              Explore activities
            </Cta>
          </div>
        </div>

        <PromptWall />
      </div>
    </section>
  )
}

/** Two lanes of real prompts drifting in opposite directions: what you'll learn to write. */
function PromptWall() {
  const half = Math.ceil(prompts.length / 2)
  const lanes = [prompts.slice(0, half), prompts.slice(half)]
  return (
    <div
      role="region"
      aria-label="Example prompts people learn to write"
      className="fade-y grid h-[22rem] grid-cols-1 gap-3 overflow-hidden animate-[fade-up_1.2s_var(--ease-out-expo)_0.5s_both] sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:h-[min(40rem,78dvh)]"
    >
      {lanes.map((lane, l) => (
        <div key={l} className={l === 1 ? 'hidden sm:block lg:hidden' : ''}>
          <ul className={`${l === 0 ? 'animate-marquee-up' : 'animate-marquee-down'} hover:[animation-play-state:paused]`}>
            {[...lane, ...lane].map((p, j) => (
              <li key={j} aria-hidden={j >= lane.length || undefined} className="pb-3">
                <figure
                  className={`rounded-card p-4 ring-1 ring-inset transition-colors duration-500 ${
                    j % lane.length === 1
                      ? 'bg-[color-mix(in_oklab,var(--tone-a)_14%,var(--color-surface-1))] ring-[color-mix(in_oklab,var(--tone-a)_40%,transparent)]'
                      : 'bg-surface-1/85 ring-white/[0.08]'
                  }`}
                >
                  <figcaption className="flex items-center gap-1.5 text-xs text-ink-faint">
                    <Sparkle size={12} weight="fill" style={{ color: 'var(--tone-a)' }} />
                    {p.who}
                  </figcaption>
                  <blockquote className="mt-2 text-[15px] leading-snug text-ink/90">{p.text}</blockquote>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
