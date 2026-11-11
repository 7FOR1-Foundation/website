import Link from 'next/link'

/** Shown for any address that doesn't exist, inside the normal header and footer. */
export default function NotFound() {
  return (
    <section aria-labelledby="page-title" className="container-page py-20 sm:py-28">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-bold tracking-widest text-brand-600 uppercase">Error 404</p>
        <h1 id="page-title" className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
          We can’t find that page
        </h1>
        <p className="mt-4 text-lg leading-8">
          The link may be out of date, or the address may have a typo. Try one of these instead:
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary">
            Go to the home page
          </Link>
          <Link href="/initiatives" className="btn-outline">
            See our initiatives
          </Link>
        </div>
      </div>
    </section>
  )
}
