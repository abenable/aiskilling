import { createLink } from '@tanstack/react-router'
import { ArrowUpRight } from '@phosphor-icons/react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import type { ComponentPropsWithRef, PointerEvent, ReactNode } from 'react'

export const easeOutExpo = [0.16, 1, 0.3, 1] as const

/** Fade-up with a blur settle as the block scrolls into view (below-the-fold content only). */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: easeOutExpo }}
    >
      {children}
    </motion.div>
  )
}

/** Headline that rises in word by word. Pure CSS so it paints before hydration. */
export function Words({ text, delay = 0, step = 0.07 }: { text: string; delay?: number; step?: number }) {
  return text.split(' ').map((w, i) => (
    <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
      <span
        className="inline-block animate-[word-in_1.1s_var(--ease-out-expo)_both]"
        style={{ animationDelay: `${delay + i * step}s` }}
      >
        {w}
        {' '}
      </span>
    </span>
  ))
}

/** Pulls its child toward the cursor on fine pointers. Motion values only, no re-renders. */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })
  return (
    <motion.span
      className="inline-flex"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
  )
}

const ctaStyles = {
  primary: 'bg-ink text-canvas shadow-[0_8px_30px_-8px_rgb(255_255_255/0.35)]',
  ghost: 'bg-white/[0.06] text-ink ring-1 ring-inset ring-white/12 backdrop-blur-md hover:bg-white/[0.1]',
}
const ctaIcon = {
  primary: 'bg-canvas text-ink',
  ghost: 'bg-white/10 text-ink',
}

/** The CTA look as a plain anchor, for external and mailto links. */
export function CtaAnchor({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ComponentPropsWithRef<'a'> & { variant?: keyof typeof ctaStyles }) {
  return (
    <Magnetic>
      <a
        {...props}
        className={`group inline-flex items-center gap-3 rounded-full py-1.5 pr-1.5 pl-6 text-[15px] font-medium whitespace-nowrap transition-[scale,background-color] duration-300 ease-out-expo active:scale-[0.96] ${ctaStyles[variant]} ${className}`}
      >
        {children}
        <span
          className={`grid size-9 place-items-center rounded-full transition-transform duration-500 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 ${ctaIcon[variant]}`}
        >
          <ArrowUpRight size={16} weight="bold" className="transition-transform duration-500 ease-spring group-hover:rotate-45" />
        </span>
      </a>
    </Magnetic>
  )
}

/** Pill CTA with a nested arrow "island". Typed like a router Link. */
export const Cta = createLink(CtaAnchor)

/** Feeds the cursor position into a .spotlight element's CSS vars. */
export function spotlight(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}
