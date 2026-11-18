/**
 * Starting content for the Donate page (November 2026). After the first run,
 * edit it in the admin (Content → Donate page): this only fills the page while
 * it is empty, unless `force` is passed. Amounts are in FCFA.
 *
 *   pnpm seed:donate
 */
import type { Payload } from 'payload'

import { ctx } from './helpers'

/** A Lesson Away's secondary school phase (2027/28): 2 students, about 100,000 FCFA each. */
export const SECONDARY_CAMPAIGN = (lessonAway?: number) => ({
  title: 'Secondary school phase 2027/28',
  label: 'Planned for 2027/28',
  text: 'Finishing primary school should be a beginning, not the end. From the 2027/28 school year, A Lesson Away will support students through secondary school, starting with 2 students.',
  goal: 200000,
  needs: [{ amount: 200000, text: 'secondary school costs for 2 students for the 2027/28 school year, about 100,000 FCFA each' }],
  ...(lessonAway ? { initiative: lessonAway } : {}),
})

const initiativeId = async (payload: Payload, slug: string) => {
  const { docs } = await payload.find({
    collection: 'initiatives',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
  })
  return docs[0]?.id
}

export const seedDonatePage = async (payload: Payload, { force = false } = {}) => {
  const existing = await payload.findGlobal({ slug: 'donate-page', depth: 0 })
  if (existing.campaigns?.items?.length && !force) {
    payload.logger.info('The Donate page already has content; leaving it as it is.')
    return
  }

  const lessonAway = await initiativeId(payload, 'a-lesson-away')
  const digitalSkills = await initiativeId(payload, 'digital-skills-training')

  await payload.updateGlobal({
    slug: 'donate-page',
    context: ctx(),
    data: {
      intro: {
        title: 'Donate',
        text: 'Every gift goes straight to our work with children and people with disabilities in Cameroon. Choose what you’d like to support below, and we’ll contact you personally to arrange your gift and send you a receipt.',
      },
      campaigns: {
        heading: 'What your gift supports',
        items: [
          {
            title: 'Back to school 2026/27',
            label: 'Ongoing',
            text: '13 students are in class this year with our support. Help us finish paying their school fees, and give 5 students who can’t read yet the extra lessons they need to catch up.',
            raised: 380000,
            goal: 710000,
            needs: [
              { amount: 130000, text: 'to finish paying this year’s school fees' },
              {
                amount: 200000,
                text: 'extra lessons in sounds and word building for 5 students who can’t read yet',
              },
            ],
            ...(lessonAway ? { initiative: lessonAway } : {}),
          },
          SECONDARY_CAMPAIGN(lessonAway),
          {
            title: 'Digital Skills Initiative 2027',
            label: 'Starting in 2027',
            text: 'A three-day smartphone training in Buea for at least 10 blind and visually impaired people. Each participant receives a smartphone with a screen reader and learns to make calls, send messages, use WhatsApp and find information online, then joins the 7FOR1 Digital Inclusion Network for follow-up support.',
            goal: 645000,
            needs: [
              {
                amount: 500000,
                text: '10 smartphones with a screen reader, one for each participant',
              },
              { amount: 75000, text: 'the training venue for three days' },
              { amount: 70000, text: 'transport and meals for participants' },
            ],
            ...(digitalSkills ? { initiative: digitalSkills } : {}),
          },
        ],
      },
      form: {
        heading: 'I’d like to give',
        text: [
          'Tell us what you’d like to support and, if you know it, roughly how much. A member of our team will contact you personally within 3 working days to arrange your gift, and we’ll send you a receipt once it arrives.',
          'We never ask for card or bank details through this website.',
        ].join('\n\n'),
      },
    },
  })
  payload.logger.info('Donate page filled with its starting content.')
}
