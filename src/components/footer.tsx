import { Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { site } from '#/content'
import { Logo } from './nav'

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['45%', '0%'])
  const opacity = useTransform(scrollYProgress, [0.2, 1], [0, 1])

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-white/[0.06] pt-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-[2fr_1fr_1fr] md:px-8">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-ink-muted">Hands-on AI sessions in Kampala and across Africa for students, professionals, startups and teams.</p>
        </div>
        <div>
          <h2 className="font-sans text-sm text-ink-faint">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            <li><Link to="/activities" className="transition-colors hover:text-accent">Activities</Link></li>
            <li><Link to="/" hash="how" className="transition-colors hover:text-accent">How it works</Link></li>
            <li><Link to="/" hash="upcoming" className="transition-colors hover:text-accent">Upcoming sessions</Link></li>
            <li><Link to="/join" className="transition-colors hover:text-accent">Join the community</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-sm text-ink-faint">Contact</h2>
          <a href={`mailto:${site.email}`} className="mt-4 inline-block break-all transition-colors hover:text-accent">
            {site.email}
          </a>
        </div>
      </div>

      <motion.p
        aria-hidden
        style={{ y, opacity }}
        className="mt-16 bg-linear-to-b from-white/[0.16] to-white/0 bg-clip-text text-center font-display text-[16.5vw] leading-[0.82] font-bold tracking-[-0.065em] whitespace-nowrap text-transparent select-none"
      >
        {site.name}
      </motion.p>
      <p className="mx-auto max-w-7xl px-5 pb-8 text-sm text-ink-faint md:px-8">
        © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  )
}
