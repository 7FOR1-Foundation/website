import type { Metadata } from 'next'
import Image from 'next/image'

import { CmsLink } from '@/components/CmsLink'
import { HeroPattern } from '@/components/HeroPattern'
import { BinocularsIcon, CheckIcon, MapPinIcon, TargetIcon } from '@/components/icons'
import { InitiativeCard } from '@/components/InitiativeCard'
import { isValueIcon, ValueIcon, valueIconColour } from '@/components/ValueIcon'
import { siteLinks } from '@/lib/links'
import { asMedia, getAboutPage, getFeaturedInitiatives, getHomePage, getSiteSettings } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Who we are: the story, mission, vision and values of Seven For One Association (7FOR1), which trains Africans with disabilities in digital skills.',
}

/** Splits text typed in the admin into paragraphs at empty lines. */
const paragraphs = (text?: string | null) =>
  (text ?? '')
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)

export default async function AboutUsPage() {
  const [about, home, initiatives, settings] = await Promise.all([
    getAboutPage(),
    getHomePage(),
    getFeaturedInitiatives(),
    getSiteSettings(),
  ])
  const links = siteLinks(settings)
  const { intro, story, values, board, objectives, location, volunteering, closing } = about
  const boardMembers = (board?.members ?? []).filter((member) => member.show)
  const { mission, vision } = home.whoWeAre
  const storyImage = asMedia(story?.image)
  const storyParagraphs = paragraphs(story?.text)

  return (
    <>
      {/* Introduction */}
      <section aria-labelledby="page-title" className="on-dark relative isolate overflow-hidden bg-brand-600 text-white">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700" aria-hidden="true">
          <HeroPattern className="absolute -right-24 -bottom-32 w-[22rem] text-white/[0.07] sm:w-[28rem] lg:top-1/2 lg:right-0 lg:bottom-auto lg:w-[30rem] lg:-translate-y-1/2 lg:text-white/[0.1]" />
        </div>
        <div className="container-page pt-16 pb-24 sm:pt-20 sm:pb-32 lg:pb-36">
          <h1 id="page-title" className="text-4xl font-bold sm:text-5xl lg:text-6xl">
            {intro?.title || 'About Us'}
          </h1>
          {intro?.text ? <p className="mt-6 max-w-3xl text-lg leading-8 sm:text-xl sm:leading-9">{intro.text}</p> : null}
          {settings.tagline ? (
            <p className="mt-8 inline-block rounded-full bg-white px-5 py-2 text-sm font-bold tracking-[0.15em] text-brand-700 uppercase">
              {settings.tagline}
            </p>
          ) : null}
        </div>
      </section>

      {/* Mission and vision: shared with the home page */}
      {mission || vision ? (
        <section aria-label="Our mission and vision" className="container-page relative z-10 -mt-14 sm:-mt-20">
          <div className="grid gap-6 md:grid-cols-2">
            {mission ? (
              <div className="rounded-xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-10">
                <TargetIcon className="text-brand-500" />
                <h2 className="mt-3 text-2xl font-extrabold text-ink">Our Mission</h2>
                <p className="mt-2 leading-7">{mission}</p>
              </div>
            ) : null}
            {vision ? (
              <div className="rounded-xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-10">
                <BinocularsIcon className="text-brand-500" />
                <h2 className="mt-3 text-2xl font-extrabold text-ink">Our Vision</h2>
                <p className="mt-2 leading-7">{vision}</p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Story */}
      {storyParagraphs.length ? (
        <section aria-labelledby="story-title" className="container-page py-16 sm:py-20">
          <div className={`grid items-start gap-12 ${storyImage?.url ? 'lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16' : ''}`}>
            <div className="max-w-3xl">
              <h2 id="story-title" className="heading-section">
                {story?.heading || 'Our story'}
              </h2>
              <div className="mt-6 space-y-5 text-lg leading-8">
                {storyParagraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </div>
            {storyImage?.url ? (
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
                  <Image
                    src={storyImage.url}
                    alt={storyImage.alt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: `${storyImage.focalX ?? 50}% ${storyImage.focalY ?? 50}%` }}
                  />
                </div>
                {story?.imageCaption ? <figcaption className="mt-3 text-sm leading-6">{story.imageCaption}</figcaption> : null}
              </figure>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Values */}
      {values?.items?.length ? (
        <section aria-labelledby="values-title" className="bg-white py-16 sm:py-20">
          <div className="container-page">
            <h2 id="values-title" className="heading-section">
              {values.heading || 'Our values'}
            </h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.items.map((value, index) => {
                const icon = isValueIcon(value.icon) ? value.icon : null
                return (
                  <li
                    key={value.id ?? value.title}
                    className="rounded-xl border-t-4 border-brand-500 bg-brand-50 p-6 sm:p-8"
                    style={icon ? { borderTopColor: valueIconColour(icon) } : undefined}
                  >
                    {icon ? (
                      <ValueIcon name={icon} />
                    ) : (
                      <span className="text-sm font-bold tracking-[0.15em] text-brand-600" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                    <h3 className={`${icon ? 'mt-4' : 'mt-2'} text-xl font-extrabold text-ink`}>{value.title}</h3>
                    <p className="mt-2 leading-7">{value.text}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Objectives */}
      {objectives?.items?.length ? (
        <section aria-labelledby="objectives-title" className="container-page py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <h2 id="objectives-title" className="heading-section">
                {objectives.heading || 'What we work towards'}
              </h2>
              {objectives.intro ? <p className="mt-4 text-lg leading-8">{objectives.intro}</p> : null}
            </div>
            <ul className="grid gap-4">
              {objectives.items.map((item) => (
                <li key={item.id ?? item.text} className="flex gap-4 rounded-xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                    <CheckIcon size={16} />
                  </span>
                  <span className="leading-7">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Initiatives */}
      {initiatives.length ? (
        <section aria-labelledby="initiatives-title" className="bg-white py-16 sm:py-20">
          <div className="container-page">
            <h2 id="initiatives-title" className="heading-section">
              How we do it
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-8">Our work is organised into long-running initiatives.</p>
            <ul className="mt-10 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {initiatives.map((initiative) => (
                <li key={initiative.id}>
                  <InitiativeCard initiative={initiative} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Board: only members who have agreed to be listed */}
      {boardMembers.length ? (
        <section aria-labelledby="board-title" className="container-page py-16 sm:py-20">
          <h2 id="board-title" className="heading-section">
            {board?.heading || 'Our Executive Board'}
          </h2>
          {board?.intro ? <p className="mt-4 max-w-3xl text-lg leading-8">{board.intro}</p> : null}
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {boardMembers.map((member) => (
              <li key={member.id ?? member.name} className="flex flex-col rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] sm:p-8">
                <p className="text-sm font-bold tracking-[0.12em] text-brand-600 uppercase">{member.role}</p>
                <h3 className="mt-2 text-xl font-extrabold text-ink">{member.name}</h3>
                {member.bio ? <p className="mt-3 leading-7">{member.bio}</p> : null}
                {member.linkedin ? (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto pt-4 font-semibold text-brand-600 underline underline-offset-4 hover:text-brand-700"
                  >
                    LinkedIn<span className="sr-only"> profile of {member.name} (opens in a new tab)</span>
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Where we are */}
      {location?.text ? (
        <section aria-labelledby="location-title" className="container-page py-16 sm:py-20">
          <div className="flex flex-col gap-5 rounded-xl bg-brand-100 p-6 sm:flex-row sm:items-start sm:p-10">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
              <MapPinIcon />
            </span>
            <div>
              <h2 id="location-title" className="text-2xl font-bold text-ink sm:text-3xl">
                {location.heading || 'Where we are'}
              </h2>
              <div className="mt-3 max-w-3xl space-y-3 text-lg leading-8">
                {paragraphs(location.text).map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Ways to volunteer: leads into the Join us buttons below */}
      {volunteering?.roles?.length ? (
        <section aria-labelledby="volunteering-title" className="container-page py-16 sm:py-20">
          <h2 id="volunteering-title" className="heading-section">
            {volunteering.heading || 'Ways to volunteer'}
          </h2>
          {volunteering.intro ? <p className="mt-4 max-w-3xl text-lg leading-8">{volunteering.intro}</p> : null}
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {volunteering.roles.map((role) => (
              <li key={role.id ?? role.title} className="rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] sm:p-8">
                <h3 className="text-xl font-extrabold text-ink">{role.title}</h3>
                <p className="mt-2 leading-7">{role.text}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Closing: a card, so it doesn't run into the footer (same blue) */}
      <section aria-labelledby="closing-title" className="container-page pb-16 sm:pb-20">
        <div className="on-dark rounded-2xl bg-brand-600 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <h2 id="closing-title" className="text-3xl font-bold sm:text-4xl">
            {closing?.heading || 'Join us'}
          </h2>
          {closing?.text ? <p className="mx-auto mt-4 max-w-2xl text-lg leading-8">{closing.text}</p> : null}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <CmsLink href={links.volunteer} className="btn bg-white text-brand-700 hover:bg-brand-50">
              Volunteer with us
            </CmsLink>
            <CmsLink href={links.donate} className="btn border-2 border-white text-white hover:bg-white/10">
              Donate
            </CmsLink>
            <CmsLink href={links.contact} className="btn border-2 border-white text-white hover:bg-white/10">
              Contact us
            </CmsLink>
          </div>
        </div>
      </section>
    </>
  )
}
