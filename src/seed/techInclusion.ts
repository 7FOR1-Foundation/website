/**
 * The 7FOR1 Tech Inclusion Project (planned for 2027), a project of the Digital
 * Skills Training initiative. Drawn from the grant application (November 2026).
 * After the first run, edit it in the admin (Content → Projects): this only
 * creates it when it doesn't exist yet, unless `force` is passed.
 *
 *   pnpm seed:tech
 */
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import type { Payload } from 'payload'

import { upsertBySlug } from './helpers'

export const TECH_INCLUSION_SLUG = '7for1-tech-inclusion-project'
export const TECH_INCLUSION_TITLE = '7FOR1 Tech Inclusion Project'

const WRITE_UP = `## Why this project

Many blind and visually impaired people in Cameroon are left out of education, work and community life because they have never had the chance to learn digital skills. A smartphone with a screen reader can change that. It reads everything on the screen aloud, so a blind person can make calls, send messages, read the news and find information on their own.

## What participants will learn

- Using a smartphone with a screen reader (TalkBack on Android) and its accessibility settings
- Making calls, managing contacts and sending messages and voice notes
- Using WhatsApp, including groups and communities
- Finding information online and using helpful apps, including AI tools
- Staying safe online

## How it works

### 1. Preparation (two weeks)

We prepare the training, recruit volunteer trainers, buy and test the smartphones, and register participants, with a short check of what each person can already do.

### 2. Three days of hands-on training

- **Day 1, getting started:** accessibility settings, the screen reader and moving around the phone.
- **Day 2, communication and information:** calls, contacts, messages, voice notes, browsing the internet and WhatsApp.
- **Day 3, independence and community:** WhatsApp groups, sharing information, practical tasks, demonstrations by participants and a celebration of everyone's achievements.

### 3. Three months of follow-up

Participants join the **7FOR1 Digital Inclusion Network**, a WhatsApp community with weekly tips, support from each other, useful resources and opportunities, monthly check-ins and mentoring. Together we plan the next, more advanced training.

## What we want to achieve

- At least 10 blind and visually impaired people trained in foundational digital skills
- Every participant able to use a smartphone with a screen reader on their own
- More confidence in communicating, finding information and taking part in community life
- A support network that keeps the learning going after the training

## How we will measure it

- A short practical test before and after the training, such as making a call, sending a WhatsApp voice note and searching the web
- Feedback from participants at the end, shared publicly only with their consent
- How active participants are in the Digital Inclusion Network
- A check-in one month after the training to see how everyone is using their new skills

## Budget

- **10 smartphones**, one for each participant: 500,000 FCFA
- **Training venue** for three days: 75,000 FCFA
- **Transport** for participants: 30,000 FCFA
- **Meals and refreshments**: 40,000 FCFA
- **Total: 645,000 FCFA**

## How you can help

- **Give:** a smartphone costs about 50,000 FCFA. Any amount helps, through our [Donate page](/donate).
- **Volunteer:** help as a trainer or assistant during the three days, through our [Volunteer page](/volunteer).
- **Partner:** if your organisation could provide smartphones, mobile data or a venue, [contact us](/contact).`

export const seedTechInclusion = async (payload: Payload, { force = false } = {}) => {
  const { docs: existing } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: TECH_INCLUSION_SLUG } },
    limit: 1,
    draft: true,
    depth: 0,
  })
  if (existing[0] && !force) {
    payload.logger.info('The Tech Inclusion Project already exists; leaving it as it is.')
    return existing[0]
  }
  const { docs: initiatives } = await payload.find({
    collection: 'initiatives',
    where: { slug: { equals: 'digital-skills-training' } },
    limit: 1,
    depth: 0,
  })
  if (!initiatives[0]) throw new Error('The Digital Skills Training initiative was not found.')

  const body = convertMarkdownToLexical({
    editorConfig: await editorConfigFactory.default({ config: payload.config }),
    markdown: WRITE_UP,
  })
  const project = await upsertBySlug(payload, 'projects', TECH_INCLUSION_SLUG, {
    title: TECH_INCLUSION_TITLE,
    initiative: initiatives[0].id,
    status: 'planned',
    timing: '2027',
    location: 'Molyko, Buea',
    audience: 'At least 10 blind and visually impaired people in and around Buea',
    summary:
      'A three-day smartphone training for at least 10 blind and visually impaired people in Buea, followed by three months of support through the 7FOR1 Digital Inclusion Network.',
    body,
    fundingGoal: 645000,
    ctaLabel: 'Support this project',
    ctaLink: '/donate',
  })
  payload.logger.info('Tech Inclusion Project created.')
  return project
}
