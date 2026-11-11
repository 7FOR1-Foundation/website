import type { Metadata } from 'next'

import { InitiativeCard } from '@/components/InitiativeCard'
import { getAllInitiatives } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Our Initiatives',
  description: 'The long-running programs of the 7FOR1 Foundation and the projects carried out for each.',
}

export default async function InitiativesPage() {
  const initiatives = await getAllInitiatives()
  return (
    <section aria-labelledby="page-title" className="container-page py-16 sm:py-20">
      <h1 id="page-title" className="text-4xl font-bold text-ink sm:text-5xl">
        Our Initiatives
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-8">
        Each initiative is a long-term goal. Open one to see the projects we’ve carried out to reach it.
      </p>
      {initiatives.length ? (
        <ul className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {initiatives.map((initiative) => (
            <li key={initiative.id}>
              <InitiativeCard initiative={initiative} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12">Our initiatives will be listed here soon.</p>
      )}
    </section>
  )
}
