import type { CollectionAfterChangeHook } from 'payload'

import { emailSubscribersAboutPost } from '../lib/email/newsletter'
import type { Post } from '../payload-types'

/**
 * When a post with "Email subscribers about this post" ticked is published,
 * emails the newsletter list once and records the result in "Emailed to
 * subscribers" (which also stops it being sent again).
 */
export const emailOnPublish: CollectionAfterChangeHook<Post> = async ({ doc, req }) => {
  if (req.context?.skipEmail || doc._status !== 'published' || !doc.emailSubscribers || doc.emailedAt) return doc

  // Only the live site emails the real list; elsewhere (this computer, previews) it's skipped.
  const live = process.env.VERCEL_ENV === 'production' || process.env.NEWSLETTER_SEND === '1'
  let note: string
  try {
    note = live ? await emailSubscribersAboutPost(req.payload, doc) : 'Not sent: only the live website emails subscribers.'
  } catch (error) {
    req.payload.logger.error({ err: error }, 'Emailing subscribers about a post failed')
    // Not recorded, so saving the post again retries it.
    return doc
  }
  const emailedAt = `${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Douala', dateStyle: 'long', timeStyle: 'short' })}: ${note}`
  await req.payload.update({
    collection: 'posts',
    id: doc.id,
    data: { emailedAt },
    context: { skipEmail: true },
    req,
  })
  return { ...doc, emailedAt }
}
