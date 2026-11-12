/**
 * Updates only A Lesson Away's page and photos. Every other page and any edits
 * made in the admin are left as they are.
 *
 *   pnpm seed:ala
 */
import { getPayload } from 'payload'

import config from '../payload.config'
import { seedALessonAway } from './aLessonAway'

const run = async () => {
  const payload = await getPayload({ config })
  payload.logger.info('Updating A Lesson Away…')
  await seedALessonAway(payload)
  payload.logger.info('Done.')
  process.exit(0)
}

// Top-level await: `payload run` exits as soon as this module finishes loading.
await run().catch((error) => {
  console.error(error)
  process.exit(1)
})
