import Image from 'next/image'
import Link from 'next/link'

import { CmsLink } from '@/components/CmsLink'
import { HeroPattern } from '@/components/HeroPattern'
import { BinocularsIcon, PlayIcon, TargetIcon } from '@/components/icons'
import { InitiativeCard } from '@/components/InitiativeCard'
import { NewsletterForm } from '@/components/NewsletterForm'
import { PostCard } from '@/components/PostCard'
import { resolveHref, siteLinks } from '@/lib/links'
import { asMedia, getFeaturedInitiatives, getHomePage, getLatestPosts, getSiteSettings } from '@/lib/payload'

export default async function HomePage() {
  const [home, initiatives, posts, settings] = await Promise.all([
    getHomePage(),
    getFeaturedInitiatives(),
    getLatestPosts(3),
    getSiteSettings(),
  ])
  const links = siteLinks(settings)
  const { hero, whoWeAre, impact, disability, more } = home
  const heroImage = asMedia(hero.image)
  const disabilityImage = asMedia(disability.image)
  const insetImage = asMedia(disability.insetImage)

  return (
    <>
      {/* Hero */}
      <section aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-brand-900">
        {heroImage?.url ? (
          <>
            <Image
              src={heroImage.url}
              alt=""
              fill
              priority
              sizes="100vw"
              className="-z-10 object-cover"
              style={{ objectPosition: `${heroImage.focalX ?? 50}% ${heroImage.focalY ?? 50}%` }}
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/60 to-black/30" aria-hidden="true" />
          </>
        ) : (
          // No photo yet: a brand background with the logo's ring of figures.
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-900 via-brand-900 to-brand-700" aria-hidden="true">
            <HeroPattern className="absolute -right-24 -bottom-24 w-[24rem] text-white/[0.07] sm:-right-16 sm:w-[32rem] lg:top-1/2 lg:-right-20 lg:bottom-auto lg:w-[34rem] lg:-translate-y-[45%] lg:text-white/[0.12] xl:right-0 xl:w-[38rem] 2xl:right-[6%] 2xl:w-[42rem]" />
            <HeroPattern className="absolute -top-20 -left-20 hidden w-64 text-white/[0.04] lg:block" />
          </div>
        )}
        <div className="container-page flex min-h-[32rem] flex-col justify-center pt-16 pb-28 sm:min-h-[40rem] lg:min-h-[51.8rem] lg:pb-40">
          <h1 id="hero-title" className="max-w-3xl text-4xl leading-tight font-bold text-white sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white">{hero.text}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            {hero.primaryCta?.url ? (
              <CmsLink
                href={resolveHref(hero.primaryCta.url, links)}
                className={heroImage?.url ? 'btn-primary' : 'btn bg-white text-brand-700 hover:bg-brand-50'}
              >
                {hero.primaryCta.label || 'Volunteer with us'}
              </CmsLink>
            ) : null}
            {hero.videoUrl ? (
              <a href={hero.videoUrl} target="_blank" rel="noopener noreferrer" className="btn bg-white text-brand-600 hover:bg-brand-50">
                Watch our Story
                <PlayIcon />
                <span className="sr-only"> (video, opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* Who We Are: a white card overlapping the bottom of the hero */}
      <section aria-labelledby="who-title" className="container-page relative z-10 -mt-20 lg:-mt-32">
        <div className="rounded-xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-10 lg:px-24 lg:py-14">
          <h2 id="who-title" className="heading-section">
            {whoWeAre.heading || 'Who We Are'}
          </h2>
          <div className="mt-8 grid gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-16">
            <div>
              <TargetIcon className="text-brand-500" />
              <h3 className="mt-3 text-2xl font-extrabold text-ink">Our Mission</h3>
              <p className="mt-2 max-w-xl leading-7">{whoWeAre.mission}</p>
            </div>
            <div className="hidden w-px bg-brand-100 md:block" aria-hidden="true" />
            <div>
              <BinocularsIcon className="text-brand-500" />
              <h3 className="mt-3 text-2xl font-extrabold text-ink">Our Vision</h3>
              <p className="mt-2 max-w-xl leading-7">{whoWeAre.vision}</p>
            </div>
          </div>
          {whoWeAre.cta?.url ? (
            <div className="mt-10">
              <CmsLink href={resolveHref(whoWeAre.cta.url, links)} className="btn-primary min-w-[13.5rem]">
                {whoWeAre.cta.label || 'Learn more'}
              </CmsLink>
            </div>
          ) : null}
        </div>
      </section>

      {/* Initiatives */}
      {initiatives.length ? (
        <section aria-labelledby="initiatives-title" className="container-page py-16 sm:py-20">
          <div className="flex items-end justify-between gap-4">
            <h2 id="initiatives-title" className="heading-section">
              {home.initiatives?.heading || 'Our Initiatives'}
            </h2>
            <Link href="/initiatives" className="font-semibold text-brand-600 underline-offset-4 hover:underline">
              See all<span className="sr-only"> initiatives</span>
            </Link>
          </div>
          <ul className="mt-10 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {initiatives.map((initiative) => (
              <li key={initiative.id}>
                <InitiativeCard initiative={initiative} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Impact */}
      {impact?.stats?.length ? (
        <section aria-labelledby="impact-title" className="on-dark bg-brand-600 py-12 text-white sm:py-16">
          <div className="container-page">
            <h2 id="impact-title" className="text-center text-3xl font-bold sm:text-4xl">
              {impact?.heading || 'Our Impact'}
            </h2>
            {/* Centred row that works for any number of figures (the design had four; there are now three). */}
            <dl className="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-x-12 gap-y-10 text-center lg:gap-x-24">
              {impact.stats?.map((stat) => (
                <div key={stat.id ?? stat.label} className="flex w-full max-w-60 flex-col-reverse justify-end gap-2 sm:w-52">
                  <dt className="text-base font-semibold">{stat.label}</dt>
                  <dd className="text-4xl font-bold sm:text-5xl">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {/* Disability is not inability */}
      <section aria-labelledby="disability-title" className="bg-white py-16 sm:py-20">
        <div
          className={`container-page grid items-center gap-12 ${disabilityImage?.url ? 'lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16 xl:gap-24' : ''}`}
        >
          <div className={disabilityImage?.url ? '' : 'max-w-3xl'}>
            <h2 id="disability-title" className="text-4xl leading-[1.1] font-black tracking-tight text-ink sm:text-6xl lg:text-7xl">
              {disability.heading}
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-8">{disability.text}</p>
            {disability.cta?.url ? (
              <div className="mt-10">
                <CmsLink href={resolveHref(disability.cta.url, links)} className="btn-primary">
                  {disability.cta.label || 'Fund a training seat'}
                </CmsLink>
              </div>
            ) : null}
          </div>
          {disabilityImage?.url ? (
            <figure>
              <div className="relative">
                <div className="relative aspect-[5/3] overflow-hidden rounded-2xl shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
                  <Image
                    src={disabilityImage.url}
                    alt={disabilityImage.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: `${disabilityImage.focalX ?? 50}% ${disabilityImage.focalY ?? 50}%` }}
                  />
                </div>
                {insetImage?.url ? (
                  <div className="absolute -right-2 -bottom-8 aspect-[5/3] w-[38%] overflow-hidden rounded-xl border-4 border-white shadow-lg sm:-right-4">
                    <Image src={insetImage.url} alt={insetImage.alt} fill sizes="20vw" className="object-cover" />
                  </div>
                ) : null}
              </div>
              {disability.caption ? (
                <figcaption className="mt-12 max-w-2xl text-sm leading-6">{disability.caption}</figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      </section>

      {/* Blog: shown once the first post is published */}
      {posts.length ? (
        <section aria-labelledby="blog-title" className="container-page py-16 sm:py-20">
          <div className="flex items-end justify-between gap-4">
            <h2 id="blog-title" className="heading-section">
              {more?.blogHeading || 'Our Blogs'}
            </h2>
            <Link href="/blog" className="font-semibold text-brand-600 underline-offset-4 hover:underline">
              See all<span className="sr-only"> blog posts</span>
            </Link>
          </div>
          <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Newsletter */}
      <section aria-labelledby="newsletter-title" className="on-dark bg-night py-12 text-center text-white sm:py-16">
        <div className="container-page">
          <h2 id="newsletter-title" className="text-3xl font-bold sm:text-4xl">
            {more?.newsletterHeading || 'Stay Connected'}
          </h2>
          {more?.newsletterText ? <p className="mx-auto mt-3 max-w-2xl text-lg">{more.newsletterText}</p> : null}
          <div className="mt-8">
            <NewsletterForm source="home" />
          </div>
        </div>
      </section>
    </>
  )
}
