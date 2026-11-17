import { brevoConfigured, checkAccount } from '@/lib/email/brevo'
import { removeUnconfirmedSignups, syncConfirmedToBrevo } from '@/lib/email/newsletter'
import { payloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

/**
 * Called weekly by Vercel Cron (see vercel.json). Brevo retires API keys that
 * go unused for 90 days, so this keeps the key in use, and it retries adding
 * confirmed subscribers that didn't reach the Brevo list the first time, and
 * deletes sign-ups left unconfirmed for 30 days (see the privacy policy).
 * Harmless if called by anyone else; with CRON_SECRET set, only Vercel can.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 })
  }
  if (!brevoConfigured()) return Response.json({ ok: false, reason: 'BREVO_API_KEY is not set' }, { status: 500 })
  try {
    await checkAccount()
    const payload = await payloadClient()
    const sync = await syncConfirmedToBrevo(payload)
    const removedUnconfirmed = await removeUnconfirmedSignups(payload)
    return Response.json({ ok: true, ...sync, removedUnconfirmed })
  } catch (error) {
    console.error('Weekly newsletter check failed', error)
    return Response.json({ ok: false }, { status: 500 })
  }
}
