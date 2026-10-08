import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { site } from '#/content'
import { Cta, easeOutExpo } from './motion'

const links = [
  { label: 'Activities', to: '/activities' },
  { label: 'How it works', to: '/', hash: 'how' },
  { label: 'Pricing', to: '/', hash: 'pricing' },
  { label: 'Upcoming', to: '/', hash: 'upcoming' },
] as const

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span aria-hidden className="relative size-7 overflow-hidden rounded-[9px]">
        <span className="absolute -inset-1/2 animate-spin-slow bg-[conic-gradient(var(--color-coral),var(--color-magenta),var(--color-violet),var(--color-orange),var(--color-coral))]" />
        <span className="absolute inset-[7px] rounded-full bg-canvas" />
      </span>
      <span className="font-display text-[17px] font-semibold tracking-[-0.03em]">{site.name}</span>
    </span>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const { scrollY } = useScroll()

  // Slide away while reading down, come back on any upward scroll.
  useMotionValueEvent(scrollY, 'change', (y) => {
    setHidden(y > (scrollY.getPrevious() ?? 0) && y > 200)
  })

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <motion.header
        className="site-nav fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-5"
        animate={{ y: hidden && !open ? -110 : 0 }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
      >
        <nav
          aria-label="Main"
          className="flex h-14 w-full max-w-5xl items-center justify-between gap-6 rounded-full bg-canvas/60 pr-2 pl-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_10px_40px_-12px_rgb(0_0_0/0.8)] ring-1 ring-white/10 backdrop-blur-xl md:w-auto"
        >
          <Link to="/" aria-label={`${site.name} home`} onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          <ul className="hidden items-center md:flex" onPointerLeave={() => setHovered(null)}>
            {links.map((l) => (
              <li key={l.label} className="relative">
                <Link
                  to={l.to}
                  hash={'hash' in l ? l.hash : undefined}
                  onPointerEnter={() => setHovered(l.label)}
                  className="relative z-10 block rounded-full px-4 py-2 text-sm text-ink-muted transition-colors duration-300 hover:text-ink data-[status=active]:text-ink"
                  activeOptions={{ includeHash: true }}
                >
                  {l.label}
                </Link>
                {hovered === l.label && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-full bg-white/[0.07]"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Cta to="/join" className="py-1! pl-5! text-sm!">
              Join the community
            </Cta>
          </div>

          <button
            type="button"
            className="relative grid size-10 place-items-center rounded-full bg-white/[0.07] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span
              className={`absolute h-[1.5px] w-4 rounded-full bg-ink transition-transform duration-500 ease-spring ${open ? 'rotate-45' : '-translate-y-[3.5px]'}`}
            />
            <span
              className={`absolute h-[1.5px] w-4 rounded-full bg-ink transition-transform duration-500 ease-spring ${open ? '-rotate-45' : 'translate-y-[3.5px]'}`}
            />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-canvas/85 px-6 pt-28 pb-10 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <ul className="flex flex-col gap-2">
              {[{ label: 'Home', to: '/' as const }, ...links, { label: 'Join the community', to: '/join' as const }].map((l, i) => (
                <motion.li
                  key={l.label}
                  initial={{ opacity: 0, y: 48 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.7, delay: 0.06 + i * 0.06, ease: easeOutExpo }}
                >
                  <Link
                    to={l.to}
                    hash={'hash' in l ? l.hash : undefined}
                    onClick={() => setOpen(false)}
                    className="block py-1 font-display text-[2.6rem] leading-tight font-semibold tracking-[-0.04em]"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.a
              href={`mailto:${site.email}`}
              className="text-ink-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.4 } }}
            >
              {site.email}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
