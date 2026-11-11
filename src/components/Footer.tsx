import Link from 'next/link'

import { resolveHref, siteLinks } from '@/lib/links'
import type { SiteSetting } from '@/payload-types'

import { CmsLink } from './CmsLink'
import { MailIcon, PhoneIcon } from './icons'
import { Logo } from './Logo'
import { footerNav } from './nav'

export function Footer({ settings }: { settings: SiteSetting }) {
  const links = siteLinks(settings)
  const social = [
    { label: 'Facebook', href: settings.social?.facebook },
    // Instagram is switched off until the foundation has an account.
    // { label: 'Instagram', href: settings.social?.instagram },
    { label: 'LinkedIn', href: settings.social?.linkedin },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href))

  // Brand, Quick Links and Contact always show; Follow Us only once a social link is set.
  const columns = social.length ? 'lg:grid-cols-[1.5fr_1fr_1fr_1fr]' : 'lg:grid-cols-[1.5fr_1fr_1fr]'

  return (
    <footer className="on-dark bg-brand-600 text-white">
      <div className={`container-page grid gap-10 py-12 sm:grid-cols-2 sm:py-16 lg:items-start ${columns}`}>
        <div>
          <Link href="/" aria-label="7FOR1 Foundation home" className="inline-block">
            <Logo image={settings.logoWhite} variant="white" className="h-20 w-auto sm:h-24" />
          </Link>
          {settings.tagline ? <p className="mt-4 text-2xl sm:text-3xl">{settings.tagline}</p> : null}
        </div>

        <nav aria-labelledby="footer-links">
          <h2 id="footer-links" className="text-lg font-bold">
            Quick Links
          </h2>
          <ul className="mt-3 space-y-2">
            {footerNav.map((item) => (
              <li key={item.href}>
                <CmsLink href={resolveHref(item.href, links)} showIcon={false} className="hover:underline">
                  {item.label}
                </CmsLink>
              </li>
            ))}
          </ul>
        </nav>

        {social.length ? (
          <div>
            <h2 className="text-lg font-bold">Follow Us</h2>
            <ul className="mt-3 space-y-2">
              {social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <h2 className="text-lg font-bold">Contact</h2>
          <ul className="mt-3 space-y-3">
            {settings.phone ? (
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <PhoneIcon />
                  <span>{settings.phone}</span>
                </a>
              </li>
            ) : null}
            <li>
              <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 break-all hover:underline">
                <MailIcon className="shrink-0" />
                <span>{settings.email}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20">
        <p className="container-page py-5 text-sm text-white/90">
          © {new Date().getFullYear()} 7FOR1 (Seven For One) Foundation
        </p>
      </div>
    </footer>
  )
}
