import { site } from '#/content'

export function seo({ title, description = site.description, path = '/' }: { title?: string; description?: string; path?: string }) {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | Learn to put AI to work`
  const url = site.url + path
  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: site.name },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: `${site.url}/og.png` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: `${site.url}/og.png` },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}
