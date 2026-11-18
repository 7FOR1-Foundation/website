/**
 * Creates the 7FOR1 Tech Inclusion Project page, only while it is still
 * empty. Every other page and any edits made in the admin are left as they are.
 *
 *   pnpm seed:tech
 */
import { getPayload } from 'payload'

import config from '../payload.config'
import { seedTechInclusion } from './techInclusion'

const run = async () => {
  const payload = await getPayload({ config })
  payload.logger.info('Creating the Tech Inclusion Project…')
  await seedTechInclusion(payload)
  payload.logger.info('Done.')
  process.exit(0)
}

// Top-level await: `payload run` exits as soon as this module finishes loading.
await run().catch((error) => {
  console.error(error)
  process.exit(1)
})
