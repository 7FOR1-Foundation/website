import Link from 'next/link'

import { siteLinks } from '@/lib/links'
import type { SiteSetting } from '@/payload-types'

import { CmsLink } from './CmsLink'
import { MailIcon, PhoneIcon } from './icons'
import { Logo } from './Logo'
import { MobileNav } from './MobileNav'
import { NavLinks } from './NavLinks'

export function Header({ settings }: { settings: SiteSetting }) {
  const links = siteLinks(settings)
  return (
    <header className="relative z-30">
      <div className="on-dark bg-brand-900 text-white">
        <div className="container-page flex min-h-12 flex-wrap items-center justify-end gap-x-8 gap-y-1 py-2 text-sm sm:min-h-16 sm:text-base">
          {settings.phone ? (
            <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-2 hover:underline">
              <PhoneIcon />
              <span>{settings.phone}</span>
            </a>
          ) : null}
          <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 hover:underline">
            <MailIcon />
            <span>{settings.email}</span>
          </a>
        </div>
      </div>
      <div className="bg-white">
        <div className="container-page flex min-h-20 items-center justify-between gap-6">
          <Link href="/" className="shrink-0 py-3" aria-label="7FOR1 Foundation home">
            <Logo image={settings.logo} variant="colour" className="h-12 w-auto sm:h-14" />
          </Link>
          <NavLinks links={links} />
          <div className="hidden items-center gap-3 xl:flex">
            <CmsLink href={links.donate} showIcon={false} className="btn-primary min-w-[10rem]">
              Donate
            </CmsLink>
            <CmsLink href={links.volunteer} showIcon={false} className="btn-outline whitespace-nowrap">
              Volunteer with us
            </CmsLink>
          </div>
          <MobileNav links={links} />
        </div>
      </div>
    </header>
  )
}
