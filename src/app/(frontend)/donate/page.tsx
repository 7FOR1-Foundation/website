import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { DonationForm } from '@/components/forms/DonationForm'
import { ArrowRightIcon } from '@/components/icons'
import { PageHero } from '@/components/PageHero'
import { approxUsd, formatFcfa } from '@/lib/money'
import { asMedia, getDonatePage, getSiteSettings } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Donate',
  description:
    'Support Seven For One Association (7FOR1): help children return to school and fund digital skills training for blind and visually impaired people in Cameroon.',
}

const paragraphs = (text?: string | null) =>
  (text ?? '')
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)

/** "380,000 FCFA (about $660)" */
function Money({ amount, rate }: { amount: number; rate?: number | null }) {
  const usd = approxUsd(amount, rate)
  return (
    <>
      {formatFcfa(amount)}
      {usd ? <span className="font-normal text-body"> ({usd})</span> : null}
    </>
  )
}

export default async function DonatePage() {
  const [page, settings] = await Promise.all([getDonatePage(), getSiteSettings()])
  const rate = settings.usdRate
  const campaigns = page.campaigns?.items ?? []

  return (
    <>
      <PageHero title={page.intro?.title || 'Donate'}>
        {paragraphs(page.intro?.text).map((text) => (
          <p key={text} className="mt-3 first:mt-0">
            {text}
          </p>
        ))}
      </PageHero>

      {campaigns.length ? (
        <section aria-labelledby="campaigns-title" className="container-page py-14 sm:py-16">
          <h2 id="campaigns-title" className="heading-section">
            {page.campaigns?.heading || 'What your gift supports'}
          </h2>
          <ul className="mt-10 grid gap-8 lg:grid-cols-2">
            {campaigns.map((campaign) => {
              const image = asMedia(campaign.image)
              const initiative =
                typeof campaign.initiative === 'object' ? campaign.initiative : null
              const raised = campaign.raised ?? 0
              const goal = campaign.goal ?? 0
              // A progress bar only once fundraising has started; before that, just the goal.
              const started = typeof campaign.raised === 'number' && campaign.raised > 0
              const percent =
                started && goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : null
              const remaining = goal > raised ? goal - raised : 0
              return (
                <li
                  key={campaign.id ?? campaign.title}
                  className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
                >
                  {image?.url ? (
                    <div className="relative aspect-[16/9] bg-brand-100">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        className="object-cover"
                        style={{ objectPosition: `${image.focalX ?? 50}% ${image.focalY ?? 50}%` }}
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    {campaign.label ? (
                      <p className="self-start rounded-full bg-brand-100 px-3 py-1 text-sm font-bold text-brand-700">
                        {campaign.label}
                      </p>
                    ) : null}
                    <h3 className="mt-3 text-2xl font-extrabold text-ink">{campaign.title}</h3>
                    <div className="mt-3 space-y-3 leading-7">
                      {paragraphs(campaign.text).map((text) => (
                        <p key={text}>{text}</p>
                      ))}
                    </div>

                    {percent !== null ? (
                      <div className="mt-6">
                        <p className="font-bold text-ink">
                          <Money amount={raised} rate={rate} /> raised of{' '}
                          <Money amount={goal} rate={rate} />
                        </p>
                        <div
                          role="progressbar"
                          aria-label={`${campaign.title}: amount raised`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={percent}
                          aria-valuetext={`${percent}% of the goal raised`}
                          className="mt-3 h-3 overflow-hidden rounded-full bg-brand-100"
                        >
                          <div
                            className="h-full rounded-full bg-brand-600"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <p className="mt-2 text-sm text-body">
                          {percent}% raised
                          {remaining
                            ? ` · ${formatFcfa(remaining)} still needed`
                            : ' · fully funded, thank you!'}
                        </p>
                      </div>
                    ) : goal > 0 ? (
                      <p className="mt-6 font-bold text-ink">
                        Goal: <Money amount={goal} rate={rate} />
                      </p>
                    ) : null}

                    {campaign.needs?.length ? (
                      <div className="mt-6">
                        <h4 className="font-bold text-ink">
                          {percent !== null && remaining
                            ? 'What we still need'
                            : 'What it pays for'}
                        </h4>
                        <ul className="mt-2 space-y-2">
                          {campaign.needs.map((need) => (
                            <li key={need.id ?? need.text} className="flex gap-3 leading-7">
                              <span
                                aria-hidden="true"
                                className="mt-2.5 size-2 shrink-0 rounded-full bg-brand-500"
                              />
                              <span>
                                {need.amount ? (
                                  <strong className="text-ink">
                                    <Money amount={need.amount} rate={rate} />
                                    {': '}
                                  </strong>
                                ) : null}
                                {need.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {initiative?.slug ? (
                      <p className="mt-auto pt-6">
                        <Link
                          href={`/initiatives/${initiative.slug}`}
                          className="inline-flex items-center gap-2 font-semibold text-brand-600 underline underline-offset-4"
                        >
                          Learn more about {initiative.title}
                          <ArrowRightIcon />
                        </Link>
                      </p>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="give-title" className="bg-white py-14 sm:py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 id="give-title" className="heading-section">
              {page.form?.heading || 'I’d like to give'}
            </h2>
            <div className="mt-4 space-y-4 text-lg leading-8">
              {paragraphs(page.form?.text).map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-brand-50 p-6 sm:p-10">
            <DonationForm campaigns={campaigns.map((campaign) => campaign.title)} />
          </div>
        </div>
      </section>
    </>
  )
}
