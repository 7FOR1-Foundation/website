'use server'

import { headers } from 'next/headers'

import type { MessageType } from '@/fields/formOptions'
import {
  checkContact,
  checkDonation,
  checkVolunteer,
  type FormState,
  type FormValues,
  looksLikeABot,
  readForm,
  saveAndNotify,
} from '@/lib/forms/submit'
import { getAboutPage, getDonatePage, payloadClient } from '@/lib/payload'

// Simple in-memory limit per IP, like the newsletter form: enough to slow bots down.
const recent = new Map<string, number[]>()
const LIMIT = 5
const WINDOW_MS = 60 * 60 * 1000

const tooMany = async () => {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  hits.push(now)
  recent.set(ip, hits)
  return hits.length > LIMIT
}

const SENT: Record<MessageType, string> = {
  contact: 'Thank you! Your message has been sent. We’ve emailed you a copy of what happens next.',
  volunteer:
    'Thank you for offering to volunteer! We’ve emailed you to confirm, and we’ll be in touch soon.',
  donation:
    'Thank you! We’ve received your details and will contact you personally about your gift.',
}

async function handle(
  type: MessageType,
  values: FormValues,
  check: (values: FormValues) => {
    errors: Record<string, string>
    data: Parameters<typeof saveAndNotify>[2]
  },
): Promise<FormState> {
  // Quietly "succeed" for bots, so they learn nothing.
  if (looksLikeABot(values)) return { status: 'success', message: SENT[type] }
  const { errors, data } = check(values)
  if (Object.keys(errors).length) {
    const count = Object.keys(errors).length
    return {
      status: 'error',
      message:
        count === 1
          ? 'There is 1 thing to fix before sending.'
          : `There are ${count} things to fix before sending.`,
      errors,
      values,
    }
  }
  if (await tooMany())
    return { status: 'error', message: 'Too many attempts. Please try again in an hour.', values }
  try {
    await saveAndNotify(await payloadClient(), type, data)
    return { status: 'success', message: SENT[type] }
  } catch (error) {
    console.error(`Saving a ${type} form failed`, error)
    return {
      status: 'error',
      message: 'Something went wrong and your form wasn’t sent. Please try again later.',
      values,
    }
  }
}

export async function sendContact(_prev: FormState, formData: FormData) {
  return handle('contact', readForm(formData), checkContact)
}

export async function sendVolunteer(_prev: FormState, formData: FormData) {
  const about = await getAboutPage()
  const ways = (about.volunteering?.roles ?? []).map((role) => role.title)
  return handle('volunteer', readForm(formData, ['ways', 'availability']), (values) =>
    checkVolunteer(values, ways),
  )
}

export async function sendDonation(_prev: FormState, formData: FormData) {
  const donate = await getDonatePage()
  const campaigns = (donate.campaigns?.items ?? []).map((campaign) => campaign.title)
  return handle('donation', readForm(formData), (values) => checkDonation(values, campaigns))
}
