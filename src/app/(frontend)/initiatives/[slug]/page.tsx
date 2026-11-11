import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CmsLink } from '@/components/CmsLink'
import { TypeTag } from '@/components/InitiativeCard'
import { ProjectCard } from '@/components/ProjectCard'
import { asMedia, getAllInitiatives, getInitiativeBySlug, getProjectsForInitiative } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const initiatives = await getAllInitiatives()
  return initiatives.filter((i) => i.slug).map((i) => ({ slug: i.slug as string }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const initiative = await getInitiativeBySlug(slug)
  if (!initiative) return {}
  return { title: initiative.title, description: initiative.summary }
}

export default async function InitiativePage({ params }: Props) {
  const { slug } = await params
  const initiative = await getInitiativeBySlug(slug)
  if (!initiative) notFound()
  const projects = await getProjectsForInitiative(initiative.id)
  const cover = asMedia(initiative.coverImage)

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
          <li aria-current="page">{initiative.title}</li>
        </ol>
      </nav>

      <header className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <TypeTag type={initiative.type} />
          <h1 className="mt-4 text-4xl font-bold text-ink sm:text-5xl">{initiative.title}</h1>
          <p className="mt-6 text-lg leading-8">{initiative.goal || initiative.summary}</p>
          {initiative.externalUrl ? (
            <CmsLink href={initiative.externalUrl} className="btn-outline mt-8">
              {initiative.ctaLabel || `Visit ${initiative.title}`}
            </CmsLink>
          ) : null}
        </div>
        {cover?.url ? (
          <div className="relative aspect-[522/376] overflow-hidden rounded-xl bg-brand-100">
            <Image src={cover.url} alt={cover.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        ) : null}
      </header>

      {initiative.body ? (
        <div className="prose-content mt-12 max-w-3xl text-lg leading-8">
          <RichText data={initiative.body} />
        </div>
      ) : null}

      <section aria-labelledby="projects-title" className="mt-16">
        <h2 id="projects-title" className="heading-section">
          Projects
        </h2>
        {projects.length ? (
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <li key={project.id}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-lg">The first project for this initiative is coming soon.</p>
        )}
      </section>
    </article>
  )
}
