import Image from 'next/image'

import { asMedia } from '@/lib/payload'
import type { Initiative } from '@/payload-types'

import { CmsLink } from './CmsLink'

export const typeLabels: Record<Initiative['type'], string> = {
  core: 'Core Program',
  recurring: 'Recurring Program',
  sister: 'Sister Initiative',
}

export function TypeTag({ type }: { type: Initiative['type'] }) {
  const colour = type === 'sister' ? 'bg-sister' : 'bg-brand-100'
  return (
    <span className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold text-ink ${colour}`}>
      {typeLabels[type]}
    </span>
  )
}

export function InitiativeCard({ initiative }: { initiative: Initiative }) {
  const image = asMedia(initiative.coverImage)
  const href = `/initiatives/${initiative.slug}`
  const label = initiative.ctaLabel || `Explore ${initiative.title}`

  return (
    <article className="flex h-full flex-col">
      <div className="relative aspect-[522/376] overflow-hidden rounded-xl bg-brand-100">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            style={{ objectPosition: `${image.focalX ?? 50}% ${image.focalY ?? 50}%` }}
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col px-2 pt-5">
        <div>
          <TypeTag type={initiative.type} />
        </div>
        <h3 className="mt-3 text-xl font-bold text-ink sm:text-2xl">{initiative.title}</h3>
        <p className="mt-2 leading-7">{initiative.summary}</p>
        <div className="mt-auto pt-6">
          <CmsLink href={href} className="btn-primary">
            {label}
          </CmsLink>
        </div>
      </div>
    </article>
  )
}
