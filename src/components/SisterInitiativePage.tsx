import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import { isHex, mix, readableOn } from '@/lib/colour'
import { asMedia } from '@/lib/payload'
import type { Initiative, Project } from '@/payload-types'

import { CmsLink } from './CmsLink'
import { ProjectCard } from './ProjectCard'

type Props = { initiative: Initiative; projects: Project[]; supportHref?: string | null; appealHref?: string | null }

const number = new Intl.NumberFormat('en')

/**
 * A sister initiative's page, dressed in that initiative's own branding until
 * it has a website of its own. Every section hides itself when left empty.
 */
export function SisterInitiativePage({ initiative, projects, supportHref, appealHref }: Props) {
  const s = initiative.sister ?? {}
  const dark = isHex(s.darkColour) ? s.darkColour : '#143f61'
  const main = isHex(s.mainColour) ? s.mainColour : '#1c78c3'
  const accent = isHex(s.accentColour) ? s.accentColour : '#d86b26'

  // Brand colours, adjusted where needed so text on them stays readable.
  const theme = {
    '--sis-dark': dark,
    '--sis-main': main,
    '--sis-accent': accent,
    '--sis-on-white': readableOn(main), // links and small text on white
    '--sis-button': readableOn(accent), // white text on buttons
    '--sis-button-hover': mix(readableOn(accent), '#000000', 0.12),
    '--sis-pale': mix(main, '#ffffff', 0.86),
    '--sis-paler': mix(main, '#ffffff', 0.94),
  } as CSSProperties

  const logo = asMedia(s.logo)
  const cover = asMedia(initiative.coverImage)
  const highlight = s.highlight
  const appeal = s.appeal
  const appealFigures = appeal?.figures ?? []
  const highlightImage = asMedia(highlight?.image)
  const stats = s.stats ?? []
  const provides = s.provides ?? []
  const steps = s.steps ?? []
  const timeline = s.timeline ?? []
  const funding = s.funding
  const fundingItems = funding?.items ?? []
  const spent = fundingItems.reduce((sum, item) => sum + (item.amount ?? 0), 0)
  const currency = funding?.currency || 'FCFA'
  const money = (value: number) => `${number.format(value)} ${currency}`
  const followLabel = initiative.externalLabel || `Follow ${initiative.title}`

  const buttons = (
    <div className="mt-10 flex flex-wrap gap-4">
      {supportHref ? (
        <CmsLink href={supportHref} className="btn bg-(--sis-button) text-white hover:bg-(--sis-button-hover)">
          Support a child
        </CmsLink>
      ) : null}
      {initiative.externalUrl ? (
        <CmsLink href={initiative.externalUrl} className="btn bg-white text-(--sis-dark) hover:bg-(--sis-paler)">
          {followLabel}
        </CmsLink>
      ) : null}
    </div>
  )

  return (
    <article style={theme}>
      {/* Hero: the initiative's banner colours, dark on the left to bright on the right */}
      <header className="on-dark relative isolate overflow-hidden bg-(--sis-dark) bg-gradient-to-r from-(--sis-dark) to-(--sis-main) text-white">
        <svg className="absolute inset-x-0 bottom-0 -z-10 h-24 w-full text-white/10 sm:h-32" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 120V96C320 40 720 8 1080 18c150 4 270 20 360 36v66z" />
        </svg>
        <div className="container-page grid items-center gap-10 pt-10 pb-24 sm:pb-28 lg:grid-cols-[minmax(0,1fr)_auto] lg:pt-14 lg:pb-32">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm">
              <ol className="flex flex-wrap gap-2">
                <li>
                  <Link href="/initiatives" className="underline underline-offset-4">
                    Initiatives
                  </Link>
                  <span aria-hidden="true"> /</span>
                </li>
                <li aria-current="page">{initiative.title}</li>
              </ol>
            </nav>
            {logo?.url ? (
              <Image src={logo.url} alt="" width={96} height={96} className="mt-8 size-20 rounded-2xl sm:size-24 lg:hidden" />
            ) : null}
            <p className="mt-8 text-sm font-bold tracking-[0.15em] uppercase">A sister initiative of the 7FOR1 Foundation</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">{initiative.title}</h1>
            {s.tagline ? (
              <p className="mt-5 inline-block bg-(--sis-accent) px-4 py-2 text-xl font-bold sm:text-2xl">{s.tagline}</p>
            ) : null}
            {initiative.goal ? <p className="mt-6 max-w-2xl text-lg leading-8">{initiative.goal}</p> : null}
            {buttons}
          </div>
          {logo?.url ? (
            <Image
              src={logo.url}
              alt={`${initiative.title} logo`}
              width={320}
              height={320}
              priority
              className="hidden size-72 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] lg:block xl:size-80"
            />
          ) : null}
        </div>
      </header>

      {/* Key figures */}
      {stats.length ? (
        <section aria-labelledby="figures-title" className="bg-(--sis-pale) py-12 sm:py-14">
          <div className="container-page">
            <h2 id="figures-title" className="sr-only">
              Key figures
            </h2>
            <dl className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-12 gap-y-10 text-center lg:gap-x-20">
              {stats.map((stat) => (
                <div key={stat.id ?? stat.label} className="flex w-full max-w-60 flex-col-reverse justify-end gap-2 sm:w-52">
                  <dt className="font-semibold text-ink">{stat.label}</dt>
                  <dd className="font-serif text-4xl font-bold text-(--sis-dark) sm:text-5xl">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {/* Milestone: a recent achievement, given pride of place */}
      {highlight?.title ? (
        <section aria-labelledby="milestone-title" className="container-page pt-16 sm:pt-20">
          <div
            className={`grid items-center gap-8 overflow-hidden rounded-3xl border-l-8 border-(--sis-accent) bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] sm:p-12 ${highlightImage?.url ? 'lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12' : 'md:grid-cols-[auto_minmax(0,1fr)] md:gap-10'}`}
          >
            {highlightImage?.url ? null : (
              <span className="flex size-20 items-center justify-center rounded-full bg-(--sis-accent) sm:size-24" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="size-11 text-white sm:size-14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
                  <path d="M2 9.5 12 5l10 4.5L12 14 2 9.5Z" fill="currentColor" />
                  <path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" />
                  <path d="M21 10v5" />
                </svg>
              </span>
            )}
            <div>
              {highlight.label ? (
                <p className="inline-block rounded-full bg-(--sis-button) px-4 py-1 text-sm font-bold tracking-wide text-white uppercase">{highlight.label}</p>
              ) : null}
              <h2 id="milestone-title" className="mt-4 font-serif text-3xl leading-tight font-bold text-(--sis-dark) sm:text-4xl">
                {highlight.title}
              </h2>
              {highlight.text ? <p className="mt-4 max-w-3xl text-lg leading-8">{highlight.text}</p> : null}
            </div>
            {highlightImage?.url ? (
              <figure className="mx-auto w-fit max-w-full">
                {/* Whole photo, uncropped, so the watermark stays visible */}
                <Image
                  src={highlightImage.url}
                  alt={highlightImage.alt}
                  width={highlightImage.width ?? 1200}
                  height={highlightImage.height ?? 900}
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  className="mx-auto h-auto max-h-[36rem] w-auto max-w-full rounded-2xl bg-(--sis-pale)"
                />
                {highlight.imageCaption ? <figcaption className="mt-3 text-center text-sm leading-6">{highlight.imageCaption}</figcaption> : null}
              </figure>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Current appeal: this school year's students and what has been raised so far */}
      {appeal?.title ? (
        <section aria-labelledby="appeal-title" className="container-page pt-8 sm:pt-10">
          <div className="on-dark grid gap-10 rounded-3xl bg-(--sis-dark) bg-gradient-to-br from-(--sis-dark) to-(--sis-main) p-8 text-white shadow-[0_8px_32px_rgba(0,0,0,0.15)] sm:p-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center lg:gap-16">
            <div>
              {appeal.label ? (
                <p className="inline-block rounded-full bg-white px-4 py-1 text-sm font-bold tracking-wide text-(--sis-dark) uppercase">{appeal.label}</p>
              ) : null}
              <h2 id="appeal-title" className="mt-4 font-serif text-3xl leading-tight font-bold sm:text-4xl">
                {appeal.title}
              </h2>
              {appeal.text ? <p className="mt-4 max-w-2xl text-lg leading-8">{appeal.text}</p> : null}
              {appealHref ? (
                <div className="mt-8">
                  <CmsLink href={appealHref} className="btn bg-(--sis-button) text-white hover:bg-(--sis-button-hover)">
                    {appeal.buttonLabel || 'Donate'}
                  </CmsLink>
                </div>
              ) : null}
            </div>
            {appealFigures.length ? (
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {appealFigures.map((figure) => (
                  <div key={figure.id ?? figure.label} className="flex flex-col-reverse rounded-2xl bg-black/20 p-6 ring-1 ring-white/20">
                    <dt className="mt-1 text-lg font-semibold">{figure.label}</dt>
                    <dd className="font-serif text-4xl font-bold sm:text-5xl">{figure.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Why it exists */}
      {initiative.body ? (
        <section aria-labelledby="why-title" className="container-page py-16 sm:py-20">
          <div className={`grid items-center gap-12 ${cover?.url ? 'lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16' : ''}`}>
            <div className="max-w-3xl">
              <h2 id="why-title" className="font-serif text-3xl font-bold text-(--sis-dark) sm:text-4xl">
                Why it matters
              </h2>
              <div className="prose-content mt-6 text-lg leading-8">
                <RichText data={initiative.body} />
              </div>
            </div>
            {cover?.url ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-(--sis-pale) shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
                <Image
                  src={cover.url}
                  alt={cover.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: `${cover.focalX ?? 50}% ${cover.focalY ?? 50}%` }}
                />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* What each child receives, and how children are chosen and followed up */}
      {provides.length || steps.length ? (
        <section className="bg-(--sis-paler) py-16 sm:py-20">
          <div className="container-page grid gap-14 lg:grid-cols-2 lg:gap-20">
            {provides.length ? (
              <div aria-labelledby="provides-title" role="group">
                <h2 id="provides-title" className="font-serif text-3xl font-bold text-(--sis-dark) sm:text-4xl">
                  What each child receives
                </h2>
                <ul className="mt-8 space-y-4">
                  {provides.map((p) => (
                    <li key={p.id ?? p.item} className="flex gap-4 text-lg leading-7">
                      <svg className="mt-0.5 size-7 shrink-0 text-(--sis-accent)" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="12" fill="currentColor" />
                        <path d="m7 12.5 3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{p.item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {steps.length ? (
              <div aria-labelledby="steps-title" role="group">
                <h2 id="steps-title" className="font-serif text-3xl font-bold text-(--sis-dark) sm:text-4xl">
                  How it works
                </h2>
                <ol className="mt-8 space-y-6">
                  {steps.map((step, i) => (
                    <li key={step.id ?? step.title} className="flex gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--sis-button) text-lg font-bold text-white" aria-hidden="true">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-ink">
                          <span className="sr-only">Step {i + 1}: </span>
                          {step.title}
                        </h3>
                        {step.text ? <p className="mt-1 leading-7">{step.text}</p> : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Year by year record */}
      {timeline.length ? (
        <section aria-labelledby="timeline-title" className="container-page py-16 sm:py-20">
          <h2 id="timeline-title" className="font-serif text-3xl font-bold text-(--sis-dark) sm:text-4xl">
            Our work, year by year
          </h2>
          <ol className="mt-10 max-w-5xl border-l-4 border-(--sis-pale) pl-6 sm:pl-10">
            {timeline.map((entry) => {
              const photos = (entry.photos ?? []).map(asMedia).filter((m) => m?.url)
              return (
                <li key={entry.id ?? entry.period} className="relative pb-14 last:pb-0">
                  <span className="absolute top-1.5 -left-[2.1rem] size-5 rounded-full border-4 border-white bg-(--sis-accent) sm:-left-[3.1rem]" aria-hidden="true" />
                  <p className="inline-block rounded-full bg-(--sis-on-white) px-4 py-1 text-sm font-bold text-white">{entry.period}</p>
                  <h3 className="mt-3 text-2xl font-bold text-ink">{entry.title}</h3>
                  {entry.text ? <p className="mt-2 max-w-3xl text-lg leading-8">{entry.text}</p> : null}
                  {photos.length === 1 ? (
                    // A single photo is shown whole, at its own shape.
                    <Image
                      src={photos[0]!.url!}
                      alt={photos[0]!.alt}
                      width={photos[0]!.width ?? 1200}
                      height={photos[0]!.height ?? 900}
                      sizes="(min-width: 768px) 42rem, 100vw"
                      className="mt-6 h-auto max-h-[32rem] w-auto max-w-full rounded-xl bg-(--sis-pale)"
                    />
                  ) : photos.length ? (
                    <ul
                      className={`mt-6 grid gap-3 sm:gap-4 ${
                        photos.length === 2 ? 'grid-cols-2' : photos.length === 3 ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'
                      }`}
                    >
                      {photos.map((photo) => (
                        <li key={photo!.id} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-(--sis-pale)">
                          <Image
                            src={photo!.url!}
                            alt={photo!.alt}
                            fill
                            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 50vw"
                            className="object-cover"
                            style={{ objectPosition: `${photo!.focalX ?? 50}% ${photo!.focalY ?? 50}%` }}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}
          </ol>
        </section>
      ) : null}

      {/* Guiding quote */}
      {s.quote ? (
        <section aria-label="Quote" className="bg-(--sis-pale) py-16 sm:py-20">
          <figure className="container-page mx-auto max-w-4xl text-center">
            <span className="block font-serif text-7xl leading-none text-(--sis-accent) sm:text-8xl" aria-hidden="true">
              “
            </span>
            <blockquote className="-mt-4 font-serif text-2xl leading-snug text-(--sis-dark) italic sm:text-4xl sm:leading-tight">
              <p>{s.quote}</p>
            </blockquote>
            <figcaption className="mt-6 font-bold text-ink">{initiative.title}</figcaption>
          </figure>
        </section>
      ) : null}

      {/* Where the money goes */}
      {fundingItems.length ? (
        <section aria-labelledby="money-title" className="bg-(--sis-paler) py-16 sm:py-20">
          <div className="container-page">
            <h2 id="money-title" className="font-serif text-3xl font-bold text-(--sis-dark) sm:text-4xl">
              Where the money goes{funding?.period ? ` (${funding.period})` : ''}
            </h2>
            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
              <dl className="grid content-start gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {funding?.raised ? (
                  <div className="rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                    <dt className="font-semibold">Raised from sponsors</dt>
                    <dd className="mt-1 font-serif text-3xl font-bold text-(--sis-dark)">{money(funding.raised)}</dd>
                  </div>
                ) : null}
                <div className="rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                  <dt className="font-semibold">Spent</dt>
                  <dd className="mt-1 font-serif text-3xl font-bold text-(--sis-dark)">{money(spent)}</dd>
                </div>
                {funding?.raised && funding.raised >= spent ? (
                  <div className="rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                    <dt className="font-semibold">Left over</dt>
                    <dd className="mt-1 font-serif text-3xl font-bold text-(--sis-dark)">{money(funding.raised - spent)}</dd>
                  </div>
                ) : null}
              </dl>
              <div>
                <ul className="space-y-6">
                  {fundingItems.map((item) => {
                    const share = spent ? Math.round(((item.amount ?? 0) / spent) * 100) : 0
                    return (
                      <li key={item.id ?? item.label}>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                          <span className="text-lg font-bold text-ink">{item.label}</span>
                          <span className="font-semibold">
                            {money(item.amount ?? 0)} <span className="font-normal">({share}%)</span>
                          </span>
                        </div>
                        {item.detail ? <p className="mt-0.5 text-sm leading-6">{item.detail}</p> : null}
                        <div className="mt-2 h-3 overflow-hidden rounded-full bg-(--sis-pale)" aria-hidden="true">
                          <div className="h-full rounded-full bg-(--sis-main)" style={{ width: `${share}%` }} />
                        </div>
                      </li>
                    )
                  })}
                </ul>
                {funding?.note ? <p className="mt-8 leading-7">{funding.note}</p> : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Sponsors and what's next */}
      {s.sponsorsText || s.nextText ? (
        <section className="container-page grid gap-6 py-16 sm:py-20 lg:grid-cols-2">
          {s.sponsorsText ? (
            <div className="rounded-2xl border-t-8 border-(--sis-accent) bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-10">
              <h2 className="font-serif text-2xl font-bold text-(--sis-dark) sm:text-3xl">Thank you to our sponsors</h2>
              <p className="mt-4 text-lg leading-8 whitespace-pre-line">{s.sponsorsText}</p>
            </div>
          ) : null}
          {s.nextText ? (
            <div className="rounded-2xl border-t-8 border-(--sis-main) bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-10">
              <h2 className="font-serif text-2xl font-bold text-(--sis-dark) sm:text-3xl">What’s next</h2>
              <p className="mt-4 text-lg leading-8 whitespace-pre-line">{s.nextText}</p>
            </div>
          ) : null}
        </section>
      ) : null}

      {projects.length ? (
        <section aria-labelledby="projects-title" className="container-page pb-16 sm:pb-20">
          <h2 id="projects-title" className="font-serif text-3xl font-bold text-(--sis-dark) sm:text-4xl">
            Projects
          </h2>
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <li key={project.id}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* A note on the initiative's name, e.g. an earlier name people still use */}
      {s.nameNote ? (
        <section aria-labelledby="name-title" className="container-page pb-16 sm:pb-20">
          <div className="max-w-3xl border-l-4 border-(--sis-main) pl-6">
            <h2 id="name-title" className="font-serif text-2xl font-bold text-(--sis-dark)">
              About our name
            </h2>
            <p className="mt-3 text-lg leading-8 whitespace-pre-line">{s.nameNote}</p>
          </div>
        </section>
      ) : null}

      {/* Closing call to action */}
      <section aria-labelledby="join-title" className="on-dark bg-(--sis-dark) bg-gradient-to-r from-(--sis-dark) to-(--sis-main) py-14 text-white sm:py-16">
        <div className="container-page">
          <h2 id="join-title" className="font-serif text-3xl font-bold sm:text-4xl">
            Help a child get back to school
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8">
            Every contribution, large or small, helps a child stay in class. Follow {initiative.title} for updates on the children you help support.
          </p>
          {buttons}
        </div>
      </section>
    </article>
  )
}
