import Image from 'next/image'
import Link from 'next/link'

import { asMedia } from '@/lib/payload'
import type { Post } from '@/payload-types'

export const formatPostDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null

export function PostCard({ post }: { post: Post }) {
  const cover = asMedia(post.coverImage)
  const date = formatPostDate(post.publishedAt)
  return (
    <article>
      {cover?.url ? (
        <div className="relative aspect-[510/282] overflow-hidden rounded-xl bg-brand-100">
          <Image src={cover.url} alt={cover.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        </div>
      ) : null}
      {date ? (
        <p className={`text-sm font-semibold text-brand-600 ${cover?.url ? 'mt-5' : ''}`}>
          <time dateTime={post.publishedAt ?? undefined}>{date}</time>
        </p>
      ) : null}
      <h3 className="mt-2 text-xl font-bold text-ink">
        <Link href={`/blog/${post.slug}`} className="hover:text-brand-600 hover:underline">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 leading-7">{post.excerpt}</p>
    </article>
  )
}
