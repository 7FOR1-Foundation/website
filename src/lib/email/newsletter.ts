import { createHash, randomBytes } from 'crypto'
import type { Payload } from 'payload'

import type { Media, Post, SiteSetting } from '@/payload-types'

import { addToNewsletterList, brevoConfigured, newsletterListSize, sendCampaignToList, sendEmail } from './brevo'
import { confirmationEmail, newPostEmail } from './templates'

const CONFIRM_DAYS = 7
/** Don't send another confirmation email to the same address within this time. */
const RESEND_AFTER_MS = 10 * 60 * 1000

export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const absolute = (url: string) => (url.startsWith('/') ? new URL(url, siteUrl()).toString() : url)
const hash = (token: string) => createHash('sha256').update(token).digest('hex')

const emailBits = async (payload: Payload) => {
  const settings = (await payload.findGlobal({ slug: 'site-settings', depth: 1 })) as SiteSetting
  const logo = typeof settings.logo === 'object' && settings.logo?.url ? absolute(settings.logo.url) : null
  return { logoUrl: logo, replyTo: settings.email, siteUrl: siteUrl() }
}

/**
 * Records a sign-up and emails a confirmation link. Returns what to tell the
 * person; the same answer whether or not they were already subscribed.
 */
export async function startSubscription(payload: Payload, email: string, source: string) {
  const { docs } = await payload.find({ collection: 'subscribers', where: { email: { equals: email } }, limit: 1, depth: 0 })
  const existing = docs[0]
  if (existing?.status === 'confirmed') return 'already'

  // Without Brevo the sign-up is just kept, as before.
  if (!brevoConfigured()) {
    if (!existing) await payload.create({ collection: 'subscribers', data: { email, status: 'pending', source } })
    return 'stored'
  }

  const recentlySent = existing?.confirmSentAt && Date.now() - new Date(existing.confirmSentAt).getTime() < RESEND_AFTER_MS
  if (recentlySent) return 'sent'

  const token = randomBytes(32).toString('base64url')
  const data = { status: 'pending' as const, confirmTokenHash: hash(token), confirmSentAt: new Date().toISOString() }
  if (existing) await payload.update({ collection: 'subscribers', id: existing.id, data })
  else await payload.create({ collection: 'subscribers', data: { ...data, email, source } })

  const bits = await emailBits(payload)
  const message = confirmationEmail({ confirmUrl: `${bits.siteUrl}/newsletter/confirm?token=${token}`, ...bits })
  await sendEmail({ to: email, ...message, replyTo: bits.replyTo })
  return 'sent'
}

/** Marks the subscription confirmed and adds the person to the Brevo list. */
export async function confirmSubscription(payload: Payload, token: string): Promise<'confirmed' | 'invalid' | 'expired'> {
  if (!/^[\w-]{20,100}$/.test(token)) return 'invalid'
  const { docs } = await payload.find({
    collection: 'subscribers',
    where: { confirmTokenHash: { equals: hash(token) } },
    limit: 1,
    depth: 0,
  })
  const subscriber = docs[0]
  if (!subscriber) return 'invalid'
  const sentAt = subscriber.confirmSentAt ? new Date(subscriber.confirmSentAt).getTime() : 0
  if (Date.now() - sentAt > CONFIRM_DAYS * 24 * 60 * 60 * 1000) return 'expired'

  let synced = false
  try {
    await addToNewsletterList(subscriber.email)
    synced = true
  } catch (error) {
    // Kept as confirmed; the weekly check adds them to the list later.
    console.error('Adding a subscriber to Brevo failed', error)
  }
  await payload.update({
    collection: 'subscribers',
    id: subscriber.id,
    data: { status: 'confirmed', consentAt: new Date().toISOString(), confirmTokenHash: null, brevoSynced: synced },
  })
  return 'confirmed'
}

/** Adds confirmed subscribers that didn't reach Brevo the first time. */
export async function syncConfirmedToBrevo(payload: Payload) {
  const { docs } = await payload.find({
    collection: 'subscribers',
    where: { and: [{ status: { equals: 'confirmed' } }, { brevoSynced: { not_equals: true } }] },
    limit: 100,
    depth: 0,
  })
  let added = 0
  for (const subscriber of docs) {
    try {
      await addToNewsletterList(subscriber.email)
      await payload.update({ collection: 'subscribers', id: subscriber.id, data: { brevoSynced: true } })
      added++
    } catch (error) {
      console.error('Retrying a subscriber in Brevo failed', error)
    }
  }
  return { waiting: docs.length, added }
}

/** Unconfirmed sign-ups are deleted after this long (promised in the privacy policy). */
const UNCONFIRMED_DAYS = 30

/** Deletes sign-ups that were never confirmed, as the privacy policy promises. */
export async function removeUnconfirmedSignups(payload: Payload) {
  const cutoff = new Date(Date.now() - UNCONFIRMED_DAYS * 24 * 60 * 60 * 1000).toISOString()
  const { docs } = await payload.delete({
    collection: 'subscribers',
    where: { and: [{ status: { equals: 'pending' } }, { createdAt: { less_than: cutoff } }] },
    depth: 0,
  })
  return docs.length
}

const bylineOf = (post: Post) => {
  const names = (post.authors ?? []).flatMap((author) => (typeof author === 'object' && author ? [author.name] : []))
  return names.length ? `By ${names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0]}` : null
}

/** Emails the newsletter list about a newly published post. Returns a note for the admin. */
export async function emailSubscribersAboutPost(payload: Payload, post: Post) {
  if (!brevoConfigured()) return 'Not sent: email is not set up on this server.'
  const subscribers = await newsletterListSize()
  if (!subscribers) return 'Not sent: the newsletter list has no subscribers yet.'

  const full = (await payload.findByID({ collection: 'posts', id: post.id, depth: 1 })) as Post
  const cover = typeof full.coverImage === 'object' ? (full.coverImage as Media | null) : null
  const bits = await emailBits(payload)
  const email = newPostEmail({
    title: full.title,
    excerpt: full.excerpt,
    url: `${bits.siteUrl}/blog/${full.slug}`,
    byline: bylineOf(full),
    imageUrl: cover?.url ? absolute(cover.url) : null,
    imageAlt: cover?.alt,
    siteUrl: bits.siteUrl,
    logoUrl: bits.logoUrl,
  })
  const id = await sendCampaignToList({ name: `New post: ${full.title}`.slice(0, 250), ...email, replyTo: bits.replyTo })
  return `Sent to ${subscribers} subscriber${subscribers === 1 ? '' : 's'} (Brevo campaign ${id}).`
}
