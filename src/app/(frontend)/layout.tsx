import type { Metadata } from 'next'
import localFont from 'next/font/local'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ImageGuard } from '@/components/ImageGuard'
import { getSiteSettings } from '@/lib/payload'

import './styles.css'

// Self-hosted Lato (SIL Open Font License, see ../fonts/OFL-LICENSE.txt).
const lato = localFont({
  src: [
    { path: '../fonts/lato-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/lato-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/lato-latin-900-normal.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-lato',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: '7FOR1 Foundation · Action Over Sympathy',
    template: '%s · 7FOR1 Foundation',
  },
  description:
    'The 7FOR1 (Seven For One) Foundation trains Africans with disabilities in digital skills, builds accessible learning and advocates for lasting inclusion.',
  openGraph: { siteName: '7FOR1 Foundation', type: 'website' },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  return (
    <html lang="en" className={lato.variable}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-white px-4 py-3 font-semibold text-brand-600 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to main content
        </a>
        <Header settings={settings} />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Footer settings={settings} />
        <ImageGuard />
      </body>
    </html>
  )
}
