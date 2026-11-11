import type { SiteSetting } from '@/payload-types'

/** Where the Donate, Volunteer and Contact buttons point (set in Site settings). */
export type SiteLinks = { donate: string; volunteer: string; contact: string }

export const siteLinks = (settings: Pick<SiteSetting, 'donateUrl' | 'volunteerUrl' | 'contactUrl'>): SiteLinks => ({
  donate: settings.donateUrl || '/donate',
  volunteer: settings.volunteerUrl || '/volunteer',
  contact: settings.contactUrl || '/contact',
})

/** Swap the site's placeholder pages for the configured links, so buttons
 * stored in content (e.g. "/volunteer") follow the Site settings. */
export const resolveHref = (href: string | null | undefined, links: SiteLinks) => {
  if (!href) return href
  const map: Record<string, string> = { '/donate': links.donate, '/volunteer': links.volunteer, '/contact': links.contact }
  return map[href] ?? href
}
