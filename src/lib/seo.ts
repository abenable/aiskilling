import { site } from '#/content'

export function seo({ title, description = site.description, path = '/' }: { title?: string; description?: string; path?: string }) {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | Hands-on AI training in Kampala, Uganda`
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

/** Organization + WebSite structured data: gives Google the site name, logo and location. */
export const siteJsonLd = {
  type: 'application/ld+json',
  children: JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.url}/#org`,
        name: site.name,
        url: `${site.url}/`,
        logo: `${site.url}/logo.png`,
        email: site.email,
        description: site.description,
        address: { '@type': 'PostalAddress', addressLocality: 'Kampala', addressCountry: 'UG' },
        areaServed: [
          { '@type': 'City', name: 'Kampala' },
          { '@type': 'Country', name: 'Uganda' },
          { '@type': 'Continent', name: 'Africa' },
        ],
      },
      { '@type': 'WebSite', '@id': `${site.url}/#website`, name: site.name, url: `${site.url}/`, inLanguage: 'en', publisher: { '@id': `${site.url}/#org` } },
    ],
  }),
}
