import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CmsLink } from '@/components/CmsLink'
import { ArrowRightIcon } from '@/components/icons'
import { Money } from '@/components/Money'
import { formatDate } from '@/components/ProjectCard'
import { resolveHref, siteLinks } from '@/lib/links'
import { asMedia, getProjectBySlug, getSiteSettings, payloadClient } from '@/lib/payload'
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

const statusLabels = { planned: 'Planned', ongoing: 'Ongoing', completed: 'Completed' } as const

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSiteSettings()])
  if (!project) notFound()
  const initiative =
    typeof project.initiative === 'object' ? (project.initiative as Initiative) : null
  const cover = asMedia(project.coverImage)
  const gallery = (project.gallery ?? []).map(asMedia).filter((m) => m?.url)
  const planned = project.status === 'planned'
  const ctaHref = resolveHref(project.ctaLink, siteLinks(settings))

  const facts = [
    { term: 'Status', value: statusLabels[project.status] },
    { term: 'When', value: project.timing },
    { term: planned ? 'Starts' : 'Started', value: formatDate(project.startDate) },
    { term: planned ? 'Ends' : 'Ended', value: formatDate(project.endDate) },
    { term: 'Where', value: project.location },
    { term: 'Who it’s for', value: project.audience },
    { term: 'People reached', value: project.peopleReached?.toString() },
    { term: 'Partners', value: project.partners },
  ].filter((f) => f.value)

  const goal = project.fundingGoal ?? 0
  const raised = project.fundingRaised ?? 0
  const percent = raised > 0 && goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : null

  return (
    <article>
      {/* Header: which initiative this project belongs to comes first */}
      <header className="bg-white">
        <div className="container-page py-10 sm:py-14">
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
                  <Link
                    href={`/initiatives/${initiative.slug}`}
                    className="text-brand-600 underline"
                  >
                    {initiative.title}
                  </Link>
                  <span aria-hidden="true"> /</span>
                </li>
              ) : null}
              <li aria-current="page">{project.title}</li>
            </ol>
          </nav>

          {initiative ? (
            <p className="mt-8 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-bold text-brand-700">
              A project of our {initiative.title} initiative
            </p>
          ) : null}
          <h1
            className={`${initiative ? 'mt-4' : 'mt-8'} max-w-4xl text-4xl font-bold text-ink sm:text-5xl`}
          >
            {project.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 sm:text-xl sm:leading-9">
            {project.summary}
          </p>
        </div>
      </header>

      <div className="container-page py-12 sm:py-16">
        {/* Initiative or project? Explained once, so visitors can tell them apart. */}
        {initiative ? (
          <aside
            aria-label="How this project fits in"
            className="mb-12 rounded-xl border-l-4 border-brand-500 bg-brand-100 p-6 leading-7 sm:p-8"
          >
            <p>
              <strong className="text-ink">{initiative.title}</strong> is one of our long-running
              initiatives: a lasting commitment that we work towards year after year.{' '}
              <strong className="text-ink">{project.title}</strong> is one project within it: a
              single piece of work with its own dates, participants and budget.
            </p>
            <p className="mt-3">
              <Link
                href={`/initiatives/${initiative.slug}`}
                className="inline-flex items-center gap-2 font-semibold text-brand-600 underline underline-offset-4"
              >
                See the whole {initiative.title} initiative
                <ArrowRightIcon />
              </Link>
            </p>
          </aside>
        ) : null}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            {cover?.url ? (
              <div className="relative mb-10 aspect-[16/10] overflow-hidden rounded-xl bg-brand-100">
                <Image
                  src={cover.url}
                  alt={cover.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: `${cover.focalX ?? 50}% ${cover.focalY ?? 50}%` }}
                />
              </div>
            ) : null}
            {project.body ? (
              <div className="prose-content text-lg leading-8">
                <RichText data={project.body} />
              </div>
            ) : null}
          </div>

          <aside
            aria-label="Project details"
            className="space-y-6 lg:sticky lg:top-6 lg:self-start"
          >
            {facts.length ? (
              <div className="rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                <h2 className="text-lg font-bold text-ink">At a glance</h2>
                <dl className="mt-4 space-y-4">
                  {facts.map((f) => (
                    <div key={f.term}>
                      <dt className="text-sm font-semibold text-brand-600">{f.term}</dt>
                      <dd className="text-ink">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {goal > 0 || (ctaHref && project.ctaLabel) ? (
              <div className="rounded-xl bg-brand-600 p-6 text-white on-dark">
                {goal > 0 ? (
                  <>
                    <h2 className="text-lg font-bold">Budget</h2>
                    <p className="mt-2 text-2xl font-bold">
                      {/* The dollar figure is light grey on white elsewhere; here it stays readable on blue. */}
                      <span className="[&_span]:text-white/85">
                        <Money amount={goal} rate={settings.usdRate} />
                      </span>
                    </p>
                    {percent !== null ? (
                      <div className="mt-4">
                        <div
                          role="progressbar"
                          aria-label={`${project.title}: amount raised`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={percent}
                          aria-valuetext={`${percent}% of the budget raised`}
                          className="h-3 overflow-hidden rounded-full bg-white/25"
                        >
                          <div
                            className="h-full rounded-full bg-white"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <p className="mt-2 text-sm">
                          <Money amount={raised} /> raised ({percent}%)
                        </p>
                      </div>
                    ) : planned ? (
                      <p className="mt-2 text-sm leading-6">
                        Fundraising is open. Every contribution brings it closer.
                      </p>
                    ) : null}
                  </>
                ) : null}
                {ctaHref && project.ctaLabel ? (
                  <CmsLink
                    href={ctaHref}
                    className="btn mt-6 w-full bg-white text-brand-700 hover:bg-brand-50"
                  >
                    {project.ctaLabel}
                  </CmsLink>
                ) : null}
              </div>
            ) : null}
          </aside>
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
              More from {initiative.title}
            </Link>
          </p>
        ) : null}
      </div>
    </article>
  )
}
