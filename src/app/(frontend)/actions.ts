'use server'

import { headers } from 'next/headers'

import { payloadClient } from '@/lib/payload'

export type SubscribeState = { status: 'idle' | 'success' | 'error'; message: string; email?: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Simple in-memory limit per IP. Good enough to slow down bots on one server
// instance; Turnstile and a shared limit come with the full forms work.
const recent = new Map<string, number[]>()
const LIMIT = 5
const WINDOW_MS = 60 * 60 * 1000

const tooMany = (ip: string) => {
  const now = Date.now()
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  hits.push(now)
  recent.set(ip, hits)
  return hits.length > LIMIT
}

export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  // Bots fill the hidden "website" field; people never see it.
  if (formData.get('website')) return { status: 'success', message: 'Thank you for subscribing!' }

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!EMAIL.test(email) || email.length > 254) {
    return { status: 'error', message: 'Please enter a valid email address, like name@example.com.', email }
  }

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (tooMany(ip)) {
    return { status: 'error', message: 'Too many attempts. Please try again in an hour.', email }
  }

  try {
    const payload = await payloadClient()
    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs[0]) {
      if (existing.docs[0].status === 'unsubscribed') {
        await payload.update({
          collection: 'subscribers',
          id: existing.docs[0].id,
          data: { status: 'pending', consentAt: new Date().toISOString() },
        })
      }
    } else {
      await payload.create({
        collection: 'subscribers',
        data: {
          email,
          status: 'pending',
          source: String(formData.get('source') ?? 'home'),
          consentAt: new Date().toISOString(),
        },
      })
    }
    // Same answer whether or not the address was already on the list, so the
    // form can't be used to find out who has subscribed.
    return { status: 'success', message: 'Thank you for subscribing! We’ll keep you posted.' }
  } catch (error) {
    console.error('Newsletter sign-up failed', error)
    return { status: 'error', message: 'Something went wrong. Please try again later.', email }
  }
}
