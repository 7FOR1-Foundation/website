/**
 * Small client for the Brevo API (email sending and the subscriber list).
 * The key lives only in the BREVO_API_KEY environment variable (a Vercel
 * Secret); it is never sent to the browser.
 */
const API = 'https://api.brevo.com/v3'

/** Brevo contact list "Website subscribers". */
export const NEWSLETTER_LIST_ID = Number(process.env.BREVO_LIST_ID || 3)

/** A verified sender in Brevo (domain 7for1.org is authenticated there). */
export const SENDER = { name: '7FOR1', email: 'news@7for1.org' }

export const brevoConfigured = () => Boolean(process.env.BREVO_API_KEY)

export class BrevoError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message)
  }
}

async function brevo<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const key = process.env.BREVO_API_KEY
  if (!key) throw new BrevoError('BREVO_API_KEY is not set', 0, 'not_configured')
  const response = await fetch(`${API}${path}`, {
    method: init.method ?? 'GET',
    headers: { 'api-key': key, accept: 'application/json', 'content-type': 'application/json' },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: 'no-store',
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : {}
  if (!response.ok) {
    // Brevo's message never contains the key, so it is safe to log.
    throw new BrevoError(`Brevo ${init.method ?? 'GET'} ${path} failed: ${data.message ?? response.statusText}`, response.status, data.code)
  }
  return data as T
}

/** One email to one person (the subscription confirmation). */
export const sendEmail = (email: { to: string; subject: string; html: string; text: string; replyTo?: string }) =>
  brevo<{ messageId: string }>('/smtp/email', {
    method: 'POST',
    body: {
      sender: SENDER,
      to: [{ email: email.to }],
      subject: email.subject,
      htmlContent: email.html,
      textContent: email.text,
      ...(email.replyTo ? { replyTo: { email: email.replyTo } } : {}),
    },
  })

/** Adds (or re-adds) someone to the newsletter list once they have confirmed. */
export const addToNewsletterList = (email: string) =>
  brevo('/contacts', {
    method: 'POST',
    body: { email, listIds: [NEWSLETTER_LIST_ID], updateEnabled: true, emailBlacklisted: false },
  })

export const newsletterListSize = async () =>
  (await brevo<{ uniqueSubscribers?: number }>(`/contacts/lists/${NEWSLETTER_LIST_ID}`)).uniqueSubscribers ?? 0

/** Creates an email campaign to the newsletter list and sends it straight away. */
export async function sendCampaignToList(campaign: { name: string; subject: string; previewText: string; html: string; replyTo?: string }) {
  const { id } = await brevo<{ id: number }>('/emailCampaigns', {
    method: 'POST',
    body: {
      name: campaign.name,
      subject: campaign.subject,
      previewText: campaign.previewText,
      sender: SENDER,
      ...(campaign.replyTo ? { replyTo: campaign.replyTo } : {}),
      htmlContent: campaign.html,
      recipients: { listIds: [NEWSLETTER_LIST_ID] },
    },
  })
  await brevo(`/emailCampaigns/${id}/sendNow`, { method: 'POST' })
  return id
}

/** A harmless call that keeps the key "in use" (Brevo retires keys unused for 90 days). */
export const checkAccount = () => brevo<{ companyName?: string }>('/account')
