import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { Footer } from '#/components/footer'
import { Cta } from '#/components/motion'
import { Nav } from '#/components/nav'
import { seo } from '#/lib/seo'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => {
    const base = seo({})
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#090909' },
        ...base.meta,
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/logo.png' },
      ],
    }
  },
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main"
          className="fixed top-3 left-3 z-[70] -translate-y-20 rounded-full bg-ink px-4 py-2 text-sm text-canvas focus:translate-y-0"
        >
          Skip to content
        </a>
        {/* "user": transforms switch off under prefers-reduced-motion, opacity fades stay. */}
        <MotionConfig reducedMotion="user">
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </MotionConfig>
        <div className="grain" aria-hidden />
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <section className="atmosphere tone-violet mx-4 mt-28 mb-20 grid min-h-[60dvh] place-items-center rounded-shell px-6 py-24 text-center md:mx-8">
      <span className="blob blob-a" />
      <span className="blob blob-b" />
      <div>
        <p className="font-display text-[clamp(6rem,20vw,14rem)] leading-none font-bold tracking-[-0.06em]">404</p>
        <h1 className="mt-2 text-display-md">This page wandered off.</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-muted">The link may be old, or the page moved. Everything else is one click away.</p>
        <div className="mt-8 flex justify-center">
          <Cta to="/">Back to home</Cta>
        </div>
        <Link to="/activities" className="mt-5 inline-block text-sm text-ink-muted underline-offset-4 hover:underline">
          Explore activities
        </Link>
      </div>
    </section>
  )
}
