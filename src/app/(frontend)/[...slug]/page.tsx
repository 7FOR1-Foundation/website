import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { comingSoonPages } from '@/components/nav'
import { siteLinks } from '@/lib/links'
import { getSiteSettings } from '@/lib/payload'

/**
 * Catch-all for the public site:
 * - pages that are planned but not built yet show a short "coming soon" page;
 * - every other unknown address shows the site's own "page not found" page
 *   (with the header and footer) instead of the framework's bare 404.
 */

type Props = { params: Promise<{ slug: string[] }> }

const pageTitle = (slug: string[]) => (slug.length === 1 ? comingSoonPages[slug[0]] : undefined)

export function generateStaticParams() {
  return Object.keys(comingSoonPages).map((slug) => ({ slug: [slug] }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const title = pageTitle(slug)
  return { title: title ?? 'Page not found', robots: { index: false } }
}

export default async function ComingSoonPage({ params }: Props) {
  const { slug } = await params
  const title = pageTitle(slug)
  if (!title) notFound()
  const settings = await getSiteSettings()

  // When Site settings point Donate, Volunteer or Contact somewhere else (e.g. a
  // Google Form), old links to these pages forward there.
  const configured = siteLinks(settings)[slug[0] as keyof ReturnType<typeof siteLinks>]
  if (configured && configured !== `/${slug[0]}`) redirect(configured)

  return (
    <section aria-labelledby="page-title" className="container-page py-20 sm:py-28">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 text-center shadow-sm sm:p-12">
        <h1 id="page-title" className="text-3xl font-bold text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-8">
          This page is coming soon. In the meantime, write to us at{' '}
          <a href={`mailto:${settings.email}`} className="font-semibold text-brand-600 underline">
            {settings.email}
          </a>{' '}
          and we’ll get back to you.
        </p>
        <Link href="/" className="btn-primary mt-8">
          Back to the home page
        </Link>
      </div>
    </section>
  )
}
