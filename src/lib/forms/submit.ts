import type { Payload } from 'payload'

import {
  availabilityOptions,
  contactReasons,
  type MessageType,
  messageTypes,
  volunteerLocations,
  volunteerModes,
} from '@/fields/formOptions'
import { brevoConfigured, sendEmail } from '@/lib/email/brevo'
import { siteUrl } from '@/lib/email/newsletter'
import { teamNotificationEmail, thankYouEmail } from '@/lib/email/templates'
import type { Message, SiteSetting } from '@/payload-types'

export type FormValues = Record<string, string | string[]>
export type FormState = {
  status: 'idle' | 'success' | 'error'
  message: string
  /** Field name → what to fix, shown next to the field and in a summary. */
  errors?: Record<string, string>
  /** What was typed, so nothing is lost when there is an error. */
  values?: FormValues
}

import { GENERAL_DONATION, OTHER_WAY, REPLY_TIME } from './constants'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Reads a form into plain values: lists for checkbox groups, trimmed text otherwise. */
export const readForm = (formData: FormData, lists: string[] = []): FormValues => {
  const values: FormValues = {}
  for (const key of new Set(formData.keys())) {
    if (key.startsWith('$')) continue // React's own fields
    values[key] = lists.includes(key)
      ? formData
          .getAll(key)
          .map((v) => String(v).trim())
          .filter(Boolean)
      : String(formData.get(key) ?? '').trim()
  }
  return values
}

const text = (values: FormValues, key: string) =>
  typeof values[key] === 'string' ? (values[key] as string) : ''
const list = (values: FormValues, key: string) =>
  Array.isArray(values[key]) ? (values[key] as string[]) : []

/** Bots fill the hidden "website" field, or send the form within seconds of loading it. */
export const looksLikeABot = (values: FormValues) => {
  if (text(values, 'website')) return true
  const started = Number(text(values, 'startedAt'))
  return Number.isFinite(started) && started > 0 && Date.now() - started < 3000
}

type Check = { errors: Record<string, string>; data: Partial<Message> }

/** Lists errors in the order the fields appear on the page. */
const inOrder = (errors: Record<string, string>, order: string[]) =>
  Object.fromEntries(order.filter((field) => errors[field]).map((field) => [field, errors[field]]))

const commonChecks = (
  values: FormValues,
  { messageRequired }: { messageRequired: boolean },
): Check => {
  const errors: Record<string, string> = {}
  const name = text(values, 'name')
  const email = text(values, 'email').toLowerCase()
  const phone = text(values, 'phone')
  const message = text(values, 'message')
  if (!name) errors.name = 'Enter your name.'
  else if (name.length > 100) errors.name = 'Your name must be 100 characters or fewer.'
  if (!EMAIL.test(email) || email.length > 254)
    errors.email = 'Enter a valid email address, like name@example.com.'
  if (phone && !/^[+\d\s().-]{6,25}$/.test(phone))
    errors.phone = 'Enter a phone number using digits only, e.g. +237 6XX XX XX XX.'
  if (messageRequired && !message) errors.message = 'Enter your message.'
  if (message.length > 3000) errors.message = 'Your message must be 3,000 characters or fewer.'
  if (text(values, 'consent') !== 'yes')
    errors.consent = 'Tick the box to agree, so we can store your details and reply.'
  return { errors, data: { name, email, phone: phone || undefined, message: message || undefined } }
}

export function checkContact(values: FormValues): Check {
  const { errors, data } = commonChecks(values, { messageRequired: true })
  const reason = text(values, 'reason')
  const organisation = text(values, 'organisation')
  if (!(reason in contactReasons)) errors.reason = 'Choose what your message is about.'
  if (organisation.length > 150)
    errors.organisation = 'The organisation name must be 150 characters or fewer.'
  return {
    errors: inOrder(errors, [
      'name',
      'email',
      'phone',
      'reason',
      'organisation',
      'message',
      'consent',
    ]),
    data: { ...data, reason: reason as Message['reason'], organisation: organisation || undefined },
  }
}

export function checkVolunteer(values: FormValues, ways: string[]): Check {
  const { errors, data } = commonChecks(values, { messageRequired: false })
  const location = text(values, 'location')
  const chosenWays = list(values, 'ways').filter((way) => ways.includes(way) || way === OTHER_WAY)
  const availability = list(values, 'availability').filter((a) => a in availabilityOptions)
  const mode = text(values, 'mode')
  const skills = text(values, 'skills')
  const accessNeeds = text(values, 'accessNeeds')
  if (!(location in volunteerLocations)) errors.location = 'Choose where you are.'
  if (!chosenWays.length) errors.ways = 'Choose at least one way you’d like to help.'
  if (!availability.length) errors.availability = 'Choose at least one time you’re available.'
  if (!(mode in volunteerModes)) errors.mode = 'Choose whether you’d help in person or online.'
  if (skills.length > 1500) errors.skills = 'Please keep this to 1,500 characters or fewer.'
  if (accessNeeds.length > 1500)
    errors.accessNeeds = 'Please keep this to 1,500 characters or fewer.'
  if (text(values, 'adult') !== 'yes') errors.adult = 'Tick the box to confirm you are 18 or older.'
  return {
    errors: inOrder(errors, [
      'name',
      'email',
      'phone',
      'location',
      'ways',
      'availability',
      'mode',
      'skills',
      'accessNeeds',
      'message',
      'adult',
      'consent',
    ]),
    data: {
      ...data,
      location: location as Message['location'],
      ways: chosenWays,
      availability: availability as Message['availability'],
      mode: mode as Message['mode'],
      skills: skills || undefined,
      accessNeeds: accessNeeds || undefined,
      adult: true,
    },
  }
}

export function checkDonation(values: FormValues, campaigns: string[]): Check {
  const { errors, data } = commonChecks(values, { messageRequired: false })
  const campaign = text(values, 'campaign')
  const amount = text(values, 'amount')
  if (!campaigns.includes(campaign) && campaign !== GENERAL_DONATION)
    errors.campaign = 'Choose what you’d like to support.'
  if (amount.length > 60) errors.amount = 'Please keep this short, e.g. “50,000 FCFA”.'
  return {
    errors: inOrder(errors, ['name', 'email', 'phone', 'campaign', 'amount', 'message', 'consent']),
    data: {
      ...data,
      campaign,
      amount: amount || undefined,
      thankPublicly: text(values, 'thankPublicly') === 'yes',
    },
  }
}

const thanks: Record<MessageType, { intro: string; next: string }> = {
  contact: {
    intro: 'We’ve received your message and will read it carefully.',
    next: `We reply ${REPLY_TIME}. If you think of anything else, just reply to this email.`,
  },
  volunteer: {
    intro:
      'Thank you for offering to volunteer with Seven For One. People like you make our work possible.',
    next: `We’ll be in touch ${REPLY_TIME} to talk about how you could help.`,
  },
  donation: {
    intro: 'Thank you for wanting to support our work.',
    next: `A member of our team will contact you personally ${REPLY_TIME} to explain how to give, and we’ll send you a receipt once your gift arrives.`,
  },
}

const rowsFor = (message: Message): [string, string][] => [
  ['Name', message.name],
  ['Email', message.email],
  ['Phone / WhatsApp', message.phone ?? ''],
  ['About', message.reason ? contactReasons[message.reason] : ''],
  ['Organisation', message.organisation ?? ''],
  ['Where they are', message.location ? volunteerLocations[message.location] : ''],
  ['How they’d like to help', (message.ways ?? []).join(', ')],
  ['Availability', (message.availability ?? []).map((a) => availabilityOptions[a]).join(', ')],
  ['In person or online', message.mode ? volunteerModes[message.mode] : ''],
  ['Skills or experience', message.skills ?? ''],
  ['To take part fully', message.accessNeeds ?? ''],
  ['Would like to support', message.campaign ?? ''],
  ['Approximate amount', message.amount ?? ''],
  [
    'Thank publicly by name',
    message.type === 'donation' ? (message.thankPublicly ? 'Yes' : 'No') : '',
  ],
  ['Message', message.message ?? ''],
]

/**
 * Saves a checked form, then emails the team and thanks the sender. The form
 * counts as sent once it is saved: an email problem is logged, not shown.
 */
export async function saveAndNotify(payload: Payload, type: MessageType, data: Partial<Message>) {
  const message = (await payload.create({
    collection: 'messages',
    data: { ...data, type, status: 'new', consentAt: new Date().toISOString() } as Message,
  })) as Message

  if (!brevoConfigured()) return
  const settings = (await payload.findGlobal({ slug: 'site-settings', depth: 1 })) as SiteSetting
  const site = siteUrl()
  const logo =
    typeof settings.logo === 'object' && settings.logo?.url
      ? new URL(settings.logo.url, site).toString()
      : null
  try {
    const team = teamNotificationEmail({
      typeLabel: messageTypes[type],
      name: message.name,
      rows: rowsFor(message),
      adminUrl: `${site}/admin/collections/messages/${message.id}`,
      siteUrl: site,
    })
    await sendEmail({ to: settings.email, ...team, replyTo: message.email })
    await payload.update({ collection: 'messages', id: message.id, data: { notified: true } })
  } catch (error) {
    console.error('Emailing the team about a form failed', error)
  }
  try {
    const thank = thankYouEmail({
      name: message.name,
      ...thanks[type],
      siteUrl: site,
      logoUrl: logo,
    })
    await sendEmail({ to: message.email, ...thank, replyTo: settings.email })
  } catch (error) {
    console.error('Sending a thank-you email failed', error)
  }
}
