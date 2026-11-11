import type { Metadata } from 'next'

import { PostCard } from '@/components/PostCard'
import { getLatestPosts } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News and stories from the 7FOR1 Foundation.',
}

export default async function BlogPage() {
  const posts = await getLatestPosts(60)
  return (
    <section aria-labelledby="page-title" className="container-page py-16 sm:py-20">
      <h1 id="page-title" className="text-4xl font-bold text-ink sm:text-5xl">
        Blog
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-8">News and stories from our work.</p>
      {posts.length ? (
        <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 text-lg">Our first stories are coming soon.</p>
      )}
    </section>
  )
}
