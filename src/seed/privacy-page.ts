/**
 * Fills the privacy policy with its first draft, only while it is still
 * empty. Every other page and any edits made in the admin are left as they are.
 *
 *   pnpm seed:privacy
 */
import { getPayload } from 'payload'

import config from '../payload.config'
import { seedPrivacyPage } from './privacyPage'

const run = async () => {
  const payload = await getPayload({ config })
  payload.logger.info('Filling the privacy policy…')
  await seedPrivacyPage(payload)
  payload.logger.info('Done.')
  process.exit(0)
}

// Top-level await: `payload run` exits as soon as this module finishes loading.
await run().catch((error) => {
  console.error(error)
  process.exit(1)
})
