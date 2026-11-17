import Image from 'next/image'

import { readerNotes } from '@/fields/readerNotes'
import { asMedia } from '@/lib/payload'
import type { Author, Post } from '@/payload-types'

export const ORGANISATION_NAME = 'Seven For One Association'

/** The post's authors that are loaded (not just ids), in the order chosen in the admin. */
export const postAuthors = (post: Pick<Post, 'authors'>): Author[] =>
  (post.authors ?? []).filter((author): author is Author => typeof author === 'object' && author !== null)

/** "Jane Doe and John Doe", "A, B and C". */
const joinNames = (names: string[]) =>
  names.length < 2 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`

/** "By Jane Doe, Lawyer" under a post title; the organisation when no one is credited. */
export function Byline({ post, withCredentials = false }: { post: Pick<Post, 'authors'>; withCredentials?: boolean }) {
  const authors = postAuthors(post)
  if (!authors.length) return <>By {ORGANISATION_NAME}</>
  if (withCredentials && authors.length === 1 && authors[0].credentials) {
    return (
      <>
        By {authors[0].name}, <span className="font-normal">{authors[0].credentials}</span>
      </>
    )
  }
  return <>By {joinNames(authors.map((author) => author.name))}</>
}

/** About the author(s) and any note to readers, at the end of a post. */
export function PostFooterNotes({ post }: { post: Post }) {
  const authors = postAuthors(post)
  const note = post.readerNote === 'custom' ? post.readerNoteText : post.readerNote ? readerNotes[post.readerNote].text : null

  if (!authors.length && !note) return null
  return (
    <div className="mt-14 max-w-3xl space-y-6">
      {authors.length ? (
        <section aria-labelledby="about-authors" className="rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] sm:p-8">
          <h2 id="about-authors" className="text-sm font-bold tracking-[0.12em] text-brand-600 uppercase">
            {authors.length > 1 ? 'About the authors' : 'About the author'}
          </h2>
          <ul className="mt-5 space-y-8">
            {authors.map((author) => {
              const photo = asMedia(author.photo)
              return (
                <li key={author.id} className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  {photo?.url ? (
                    <Image
                      src={photo.url}
                      alt=""
                      width={80}
                      height={80}
                      className="size-20 shrink-0 rounded-full object-cover"
                      style={{ objectPosition: `${photo.focalX ?? 50}% ${photo.focalY ?? 30}%` }}
                    />
                  ) : null}
                  <div>
                    <p className="text-xl font-extrabold text-ink">{author.name}</p>
                    {author.credentials ? <p className="mt-1 font-semibold text-brand-700">{author.credentials}</p> : null}
                    {author.bio ? <p className="mt-3 leading-7">{author.bio}</p> : null}
                    {author.link ? (
                      <a
                        href={author.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block font-semibold text-brand-600 underline underline-offset-4 hover:text-brand-700"
                      >
                        {author.link.includes('linkedin.com') ? 'LinkedIn' : 'Website'}
                        <span className="sr-only"> of {author.name} (opens in a new tab)</span>
                      </a>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}
      {note ? (
        <aside aria-label="Note to readers" className="rounded-xl border-l-4 border-brand-500 bg-brand-100 p-5 leading-7 sm:p-6">
          <p>
            <strong className="text-ink">Please note: </strong>
            {note}
          </p>
        </aside>
      ) : null}
    </div>
  )
}
