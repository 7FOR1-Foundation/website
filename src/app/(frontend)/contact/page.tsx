import type { Metadata } from 'next'

import { ContactForm } from '@/components/forms/ContactForm'
import { MailIcon } from '@/components/icons'
import { PageHero } from '@/components/PageHero'
import { REPLY_TIME } from '@/lib/forms/constants'
import { getSiteSettings } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Seven For One Association (7FOR1): questions, partnerships, media and guest posts for our blog.',
}

export default async function ContactPage() {
  const settings = await getSiteSettings()
  return (
    <>
      <PageHero title="Contact Us">
        <p>
          Questions, partnerships, press or an idea for our blog: we’d love to hear from you. We
          reply {REPLY_TIME}.
        </p>
      </PageHero>
      <div className="container-page grid gap-10 py-14 sm:py-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
        <aside className="space-y-6 text-lg leading-8">
          <div>
            <h2 className="text-2xl font-bold text-ink">Prefer email?</h2>
            <p className="mt-2">
              <a
                href={`mailto:${settings.email}`}
                className="inline-flex items-center gap-2 font-semibold text-brand-600 underline underline-offset-4"
              >
                <MailIcon className="shrink-0" />
                <span className="break-all">{settings.email}</span>
              </a>
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink">Where we are</h2>
            <p className="mt-2">
              Headquarters in Buea, South West Region. Most of our activities take place in Douala,
              Cameroon.
            </p>
          </div>
        </aside>
        <section
          aria-label="Contact form"
          className="rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-10"
        >
          <ContactForm />
        </section>
      </div>
    </>
  )
}
