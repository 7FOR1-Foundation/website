'use client'

import { usePathname } from 'next/navigation'

import type { SiteLinks } from '@/lib/links'
import { resolveHref } from '@/lib/links'

import { CmsLink } from './CmsLink'
import { mainNav } from './nav'

export function NavLinks({ links }: { links: SiteLinks }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Main" className="hidden xl:block">
      <ul className="flex items-center gap-2 xl:gap-6">
        {mainNav.map((item) => {
          const href = resolveHref(item.href, links) as string
          const current = href === '/' ? pathname === '/' : href.startsWith('/') && pathname.startsWith(href)
          return (
            <li key={item.href}>
              <CmsLink
                href={href}
                showIcon={false}
                aria-current={current ? 'page' : undefined}
                className="rounded-md px-3 py-2 text-lg text-ink hover:text-brand-600 aria-[current=page]:font-bold aria-[current=page]:text-brand-600"
              >
                {item.label}
              </CmsLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
