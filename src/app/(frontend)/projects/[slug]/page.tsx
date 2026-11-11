import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { formatDate } from '@/components/ProjectCard'
import { asMedia, getProjectBySlug, payloadClient } from '@/lib/payload'
import type { Initiative } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    limit: 500,
    depth: 0,
    overrideAccess: false,
  })
  return docs.filter((p) => p.slug).map((p) => ({ slug: p.slug as string }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  return { title: project.title, description: project.summary }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()
  const initiative =
    typeof project.initiative === 'object' ? (project.initiative as Initiative) : null
  const cover = asMedia(project.coverImage)
  const gallery = (project.gallery ?? []).map(asMedia).filter((m) => m?.url)

  const facts = [
    { term: 'Status', value: project.status[0].toUpperCase() + project.status.slice(1) },
    { term: 'Started', value: formatDate(project.startDate) },
    { term: 'Ended', value: formatDate(project.endDate) },
    { term: 'Location', value: project.location },
    { term: 'People reached', value: project.peopleReached?.toString() },
    { term: 'Partners', value: project.partners },
  ].filter((f) => f.value)

  return (
    <article className="container-page py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/initiatives" className="text-brand-600 underline">
              Initiatives
            </Link>
            <span aria-hidden="true"> /</span>
          </li>
          {initiative ? (
            <li>
              <Link href={`/initiatives/${initiative.slug}`} className="text-brand-600 underline">
                {initiative.title}
              </Link>
              <span aria-hidden="true"> /</span>
            </li>
          ) : null}
          <li aria-current="page">{project.title}</li>
        </ol>
      </nav>

      <h1 className="mt-6 max-w-4xl text-4xl font-bold text-ink sm:text-5xl">{project.title}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8">{project.summary}</p>

      <div
        className={`mt-10 grid gap-10 ${cover?.url || project.body ? 'lg:grid-cols-[2fr_1fr]' : 'max-w-md'}`}
      >
        {cover?.url || project.body ? (
          <div>
            {cover?.url ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-brand-100">
                <Image
                  src={cover.url}
                  alt={cover.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
            {project.body ? (
              <div className="prose-content mt-10 text-lg leading-8">
                <RichText data={project.body} />
              </div>
            ) : null}
          </div>
        ) : null}
        {facts.length ? (
          <aside aria-label="Project details" className="h-fit rounded-xl bg-white p-6 shadow-sm">
            <dl className="space-y-4">
              {facts.map((f) => (
                <div key={f.term}>
                  <dt className="text-sm font-semibold text-brand-600">{f.term}</dt>
                  <dd className="text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        ) : null}
      </div>

      {gallery.length ? (
        <section aria-labelledby="gallery-title" className="mt-16">
          <h2 id="gallery-title" className="heading-section">
            Photos
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((m) => (
              <li key={m!.id} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={m!.url!}
                  alt={m!.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {initiative ? (
        <p className="mt-16">
          <Link href={`/initiatives/${initiative.slug}`} className="btn-outline">
            More projects from {initiative.title}
          </Link>
        </p>
      ) : null}
    </article>
  )
}
