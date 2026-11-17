import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { formatPostDate } from '@/components/PostCard'
import { Byline, ORGANISATION_NAME, PostFooterNotes, postAuthors } from '@/components/PostAuthors'
import { asMedia, payloadClient } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }

const getPost = async (slug: string) => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    // 2: the authors and their photos.
    depth: 2,
    overrideAccess: false,
  })
  return docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'posts', limit: 500, depth: 0, overrideAccess: false })
  return docs.filter((p) => p.slug).map((p) => ({ slug: p.slug as string }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  const cover = asMedia(post.coverImage)
  const date = formatPostDate(post.publishedAt)
  const authors = postAuthors(post)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  // Tells search engines who wrote the article and their expertise.
  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    dateModified: post.updatedAt,
    ...(cover?.url ? { image: new URL(cover.url, siteUrl).toString() } : {}),
    url: new URL(`/blog/${post.slug}`, siteUrl).toString(),
    author: authors.length
      ? authors.map((author) => ({
          '@type': 'Person',
          name: author.name,
          ...(author.credentials ? { jobTitle: author.credentials } : {}),
          ...(author.link ? { sameAs: [author.link] } : {}),
        }))
      : { '@type': 'Organization', name: ORGANISATION_NAME, url: siteUrl },
    publisher: { '@type': 'Organization', name: ORGANISATION_NAME, url: siteUrl },
  }

  return (
    <article className="container-page py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData).replace(/</g, '\\u003c') }}
      />
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/blog" className="text-brand-600 underline">
              Blog
            </Link>
            <span aria-hidden="true"> /</span>
          </li>
          <li aria-current="page">{post.title}</li>
        </ol>
      </nav>
      <header className="mt-6 max-w-3xl">
        {date ? (
          <p className="text-sm font-semibold text-brand-600">
            <time dateTime={post.publishedAt ?? undefined}>{date}</time>
          </p>
        ) : null}
        <h1 className="mt-2 text-4xl font-bold text-ink sm:text-5xl">{post.title}</h1>
        <p className="mt-4 font-semibold text-ink">
          <Byline post={post} withCredentials />
        </p>
        <p className="mt-6 text-lg leading-8">{post.excerpt}</p>
      </header>
      {cover?.url ? (
        <div className="relative mt-10 aspect-[16/9] max-w-4xl overflow-hidden rounded-xl bg-brand-100">
          <Image src={cover.url} alt={cover.alt} fill priority sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
        </div>
      ) : null}
      {post.body ? (
        <div className="prose-content mt-10 max-w-3xl text-lg leading-8">
          <RichText data={post.body} />
        </div>
      ) : null}
      <PostFooterNotes post={post} />
      <p className="mt-16">
        <Link href="/blog" className="btn-outline">
          More from our blog
        </Link>
      </p>
    </article>
  )
}
