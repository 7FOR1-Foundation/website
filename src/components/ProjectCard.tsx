import Image from 'next/image'
import Link from 'next/link'

import { asMedia } from '@/lib/payload'
import type { Project } from '@/payload-types'

const statusLabels: Record<Project['status'], string> = {
  planned: 'Planned',
  ongoing: 'Ongoing',
  completed: 'Completed',
}

export const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : null

export function ProjectCard({ project }: { project: Project }) {
  const cover = asMedia(project.coverImage)
  const when = formatDate(project.startDate)
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm focus-within:ring-3 focus-within:ring-brand-500">
      {cover?.url ? (
        <div className="relative aspect-[16/10] bg-brand-100">
          <Image src={cover.url} alt={cover.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-semibold text-brand-600">
          {statusLabels[project.status]}
          {when ? ` · ${when}` : ''}
          {project.location ? ` · ${project.location}` : ''}
        </p>
        <h3 className="mt-2 text-xl font-bold text-ink">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 hover:underline">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 leading-7">{project.summary}</p>
      </div>
    </article>
  )
}
