import { asMedia } from '@/lib/payload'
import type { SiteSetting } from '@/payload-types'

/**
 * Tells search engines who runs the site (schema.org NGO), so they can match
 * it to the registered association. Built from Site settings.
 */
export function OrganizationData({ settings, siteUrl }: { settings: SiteSetting; siteUrl: string }) {
  const absolute = (url: string) => (url.startsWith('/') ? new URL(url, siteUrl).toString() : url)
  const logo = asMedia(settings.logo)?.url
  const sameAs = [settings.social?.facebook, settings.social?.linkedin].filter((url): url is string => Boolean(url))
  const registered = settings.registration?.date

  const data = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Seven For One Association',
    alternateName: '7FOR1',
    url: siteUrl,
    ...(logo ? { logo: absolute(logo) } : {}),
    email: settings.email,
    slogan: settings.tagline || undefined,
    // Stored as a moment in time: read it as a Cameroon date (YYYY-MM-DD), not UTC.
    ...(registered ? { foundingDate: new Date(registered).toLocaleDateString('en-CA', { timeZone: 'Africa/Douala' }) } : {}),
    // Headquarters (where it is registered); most activities happen in Douala.
    address: { '@type': 'PostalAddress', addressLocality: 'Buea', addressRegion: 'South West', addressCountry: 'CM' },
    areaServed: 'Cameroon',
    ...(sameAs.length ? { sameAs } : {}),
  }

  return (
    <script
      type="application/ld+json"
      // JSON is safe to inline once "<" is escaped, so no text can close the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
