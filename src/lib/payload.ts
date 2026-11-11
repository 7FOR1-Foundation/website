import config from '@payload-config'
import { getPayload } from 'payload'

import type { HomePage, Initiative, Media, Post, Project, SiteSetting } from '@/payload-types'

export const payloadClient = () => getPayload({ config })

export const getSiteSettings = async (): Promise<SiteSetting> => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
}

export const getHomePage = async (): Promise<HomePage> => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'home-page', depth: 1 })
}

export const getFeaturedInitiatives = async (): Promise<Initiative[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'initiatives',
    where: { featured: { equals: true } },
    sort: 'sortOrder',
    limit: 6,
    depth: 1,
    overrideAccess: false,
  })
  return docs
}

export const getAllInitiatives = async (): Promise<Initiative[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'initiatives', sort: 'sortOrder', limit: 50, depth: 1, overrideAccess: false })
  return docs
}

export const getInitiativeBySlug = async (slug: string): Promise<Initiative | null> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'initiatives',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  return docs[0] ?? null
}

export const getProjectsForInitiative = async (initiativeId: number | string): Promise<Project[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { initiative: { equals: initiativeId } },
    sort: '-startDate',
    limit: 100,
    depth: 1,
    overrideAccess: false,
  })
  return docs
}

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  return docs[0] ?? null
}

export const getLatestPosts = async (limit = 3): Promise<Post[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'posts', sort: '-publishedAt', limit, depth: 1, overrideAccess: false })
  return docs
}

/** Upload fields are an id until populated; only use populated media. */
export const asMedia = (value: unknown): Media | null =>
  value && typeof value === 'object' && 'url' in value ? (value as Media) : null
