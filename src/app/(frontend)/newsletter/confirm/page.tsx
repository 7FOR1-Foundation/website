import type { Metadata } from 'next'
import Link from 'next/link'

import { confirmNewsletter } from '@/app/(frontend)/actions'

export const metadata: Metadata = { title: 'Confirm your subscription', robots: { index: false, follow: false } }

type Props = { searchParams: Promise<{ token?: string; result?: string }> }

const results: Record<string, { title: string; text: string }> = {
  confirmed: {
    title: 'You’re subscribed. Thank you!',
    text: 'You’ll receive an email when we publish a new blog post, and a short update on our work every quarter. Every email has a link to unsubscribe.',
  },
  expired: {
    title: 'This link has expired',
    text: 'Confirmation links work for 7 days. Please sign up again at the bottom of our home page and we’ll send you a new one.',
  },
  invalid: {
    title: 'This link isn’t valid',
    text: 'It may already have been used, or it was copied incompletely. If you’re not sure you’re subscribed, sign up again at the bottom of our home page.',
  },
  error: {
    title: 'Something went wrong',
    text: 'We couldn’t confirm your subscription just now. Please try the link in your email again later.',
  },
}

export default async function ConfirmSubscriptionPage({ searchParams }: Props) {
  const { token, result } = await searchParams
  const outcome = result ? (results[result] ?? results.invalid) : token ? null : results.invalid

  return (
    <section aria-labelledby="page-title" className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-12">
        {outcome ? (
          <>
            <h1 id="page-title" className="text-3xl font-bold text-ink sm:text-4xl" tabIndex={-1}>
              {outcome.title}
            </h1>
            <p className="mt-4 text-lg leading-8">{outcome.text}</p>
            <p className="mt-8">
              <Link href={result === 'confirmed' ? '/blog' : '/'} className="btn bg-brand-600 text-white hover:bg-brand-700">
                {result === 'confirmed' ? 'Read our blog' : 'Go to the home page'}
              </Link>
            </p>
          </>
        ) : (
          <>
            <h1 id="page-title" className="text-3xl font-bold text-ink sm:text-4xl">
              Confirm your subscription
            </h1>
            <p className="mt-4 text-lg leading-8">
              Press the button to start receiving emails from Seven For One Association (7FOR1): new blog posts and a short
              update every quarter.
            </p>
            <form action={confirmNewsletter} className="mt-8">
              <input type="hidden" name="token" value={token} />
              <button type="submit" className="btn bg-brand-600 text-white hover:bg-brand-700">
                Yes, subscribe me
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  )
}
