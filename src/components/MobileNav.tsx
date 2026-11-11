'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'

import type { SiteLinks } from '@/lib/links'
import { resolveHref } from '@/lib/links'

import { CmsLink } from './CmsLink'
import { CloseIcon, MenuIcon } from './icons'
import { mainNav } from './nav'

export function MobileNav({ links }: { links: SiteLinks }) {
  const pathname = usePathname()
  // Remember which page the menu was opened on; navigating elsewhere closes it.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const setOpen = (value: boolean | ((v: boolean) => boolean)) => {
    const next = typeof value === 'function' ? value(open) : value
    setOpenOn(next ? pathname : null)
  }
  const panelId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenOn(null)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex size-12 items-center justify-center rounded-lg text-ink hover:bg-brand-50"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 border-t border-brand-100 bg-white shadow-lg"
      >
        <nav aria-label="Main" className="container-page py-4">
          <ul className="flex flex-col">
            {mainNav.map((item) => {
              const href = resolveHref(item.href, links) as string
              return (
                <li key={item.href}>
                  <CmsLink
                    href={href}
                    showIcon={false}
                    aria-current={pathname === href ? 'page' : undefined}
                    className="block rounded-lg px-3 py-3 text-lg text-ink hover:bg-brand-50 aria-[current=page]:font-bold aria-[current=page]:text-brand-600"
                  >
                    {item.label}
                  </CmsLink>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <CmsLink href={links.donate} showIcon={false} className="btn-primary">
              Donate
            </CmsLink>
            <CmsLink href={links.volunteer} showIcon={false} className="btn-outline">
              Volunteer with us
            </CmsLink>
          </div>
        </nav>
      </div>
    </div>
  )
}
