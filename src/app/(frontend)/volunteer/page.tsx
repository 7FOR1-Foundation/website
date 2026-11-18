import type { Metadata } from 'next'
import Link from 'next/link'

import { VolunteerForm } from '@/components/forms/VolunteerForm'
import { PageHero } from '@/components/PageHero'
import { REPLY_TIME } from '@/lib/forms/constants'
import { getAboutPage } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Volunteer With Us',
  description:
    'Volunteer with Seven For One Association (7FOR1): support digital skills trainings, mentoring, outreach, fundraising, communications or write for our blog.',
}

export default async function VolunteerPage() {
  const about = await getAboutPage()
  const roles = about.volunteering?.roles ?? []
  return (
    <>
      <PageHero title="Volunteer With Us">
        <p>
          {about.volunteering?.intro ||
            'You don’t need special qualifications. If you have some time and care about inclusion, there’s a way for you to help.'}
        </p>
      </PageHero>
      <div className="container-page grid gap-10 py-14 sm:py-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
        <aside className="text-lg leading-8">
          <h2 className="text-2xl font-bold text-ink">Ways you can help</h2>
          <ul className="mt-4 space-y-4">
            {roles.map((role) => (
              <li key={role.id ?? role.title}>
                <p className="font-bold text-ink">{role.title}</p>
                <p className="text-base leading-7">{role.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base leading-7">
            We reply {REPLY_TIME}. Read more{' '}
            <Link
              href="/about"
              className="font-semibold text-brand-600 underline underline-offset-4"
            >
              about us
            </Link>
            .
          </p>
        </aside>
        <section
          aria-label="Volunteer form"
          className="rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-10"
        >
          <VolunteerForm ways={roles.map((role) => role.title)} />
        </section>
      </div>
    </>
  )
}
