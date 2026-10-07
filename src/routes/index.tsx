import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '#/components/home/hero'
import { Audiences, Closing, Formats, Journey, Manifesto, Skills, ToolsStrip } from '#/components/home/sections'
import { Upcoming } from '#/components/upcoming'
import { seo, siteJsonLd } from '#/lib/seo'
import { getUpcoming } from '#/server/functions'

// Full SSR for SEO; the D1-backed sessions list is deferred so the shell streams first.
export const Route = createFileRoute('/')({
  loader: () => ({ events: getUpcoming({ data: {} }) }),
  head: () => ({ ...seo({}), scripts: [siteJsonLd] }),
  component: Home,
})

function Home() {
  const { events } = Route.useLoaderData()
  return (
    <>
      <Hero />
      <ToolsStrip />
      <Manifesto />
      <Audiences />
      <Formats />
      <Skills />
      <Journey />
      <Upcoming events={events} />
      <Closing />
    </>
  )
}
