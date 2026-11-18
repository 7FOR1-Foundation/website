import type { ReactNode } from 'react'

import { HeroPattern } from './HeroPattern'

/** The blue band at the top of the Contact, Volunteer and Donate pages. */
export function PageHero({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section
      aria-labelledby="page-title"
      className="on-dark relative isolate overflow-hidden bg-brand-600 text-white"
    >
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700"
        aria-hidden="true"
      >
        <HeroPattern className="absolute -right-24 -bottom-32 w-[20rem] text-white/[0.07] sm:w-[24rem] lg:right-0 lg:w-[26rem] lg:text-white/[0.1]" />
      </div>
      <div className="container-page pt-14 pb-16 sm:pt-16 sm:pb-20">
        <h1 id="page-title" className="text-4xl font-bold sm:text-5xl">
          {title}
        </h1>
        {children ? (
          <div className="mt-5 max-w-3xl text-lg leading-8 sm:text-xl sm:leading-9">{children}</div>
        ) : null}
      </div>
    </section>
  )
}
