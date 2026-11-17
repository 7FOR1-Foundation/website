import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { formatPostDate } from '@/components/PostCard'
import { getPrivacyPage } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'What personal information Seven For One Association (7FOR1) collects through its website, why, and your rights.',
}

export default async function PrivacyPolicyPage() {
  const page = await getPrivacyPage()
  if (!page.body) notFound()
  const updated = formatPostDate(page.lastUpdated)

  return (
    <article className="container-page py-12 sm:py-16">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold text-ink sm:text-5xl">{page.title || 'Privacy policy'}</h1>
        {updated ? (
          <p className="mt-4 text-sm font-semibold text-brand-600">
            Last updated <time dateTime={page.lastUpdated ?? undefined}>{updated}</time>
          </p>
        ) : null}
      </header>
      <div className="prose-content mt-10 max-w-3xl text-lg leading-8">
        <RichText data={page.body} />
      </div>
    </article>
  )
}
