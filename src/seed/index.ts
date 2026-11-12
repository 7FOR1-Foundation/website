/**
 * Fills an empty database with the content from the Figma design, so the site
 * isn't blank on day one. Safe to run more than once: it updates what exists.
 *
 *   pnpm seed
 */
import fs from 'fs'
import path from 'path'
import type { Payload } from 'payload'
import { getPayload } from 'payload'

import config from '../payload.config'

const ctx = { disableRevalidate: true }

const FOUNDATION_FORM =
  'https://docs.google.com/forms/d/e/1FAIpQLSegSSPllfUxddHCX7FFpwHiXc1ivawt1FwSMuY7xWS0FlWGJw/viewform'

const upsertBySlug = async <T extends 'initiatives' | 'projects'>(
  payload: Payload,
  collection: T,
  slug: string,
  data: Record<string, unknown>,
) => {
  const { docs } = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, draft: true })
  const body = { ...data, slug, _status: 'published' } as never
  if (docs[0]) return payload.update({ collection, id: docs[0].id, data: body, context: ctx })
  return payload.create({ collection, data: body, context: ctx })
}

const uploadIfPresent = async (
  payload: Payload,
  file: string,
  alt: string,
  consentNote?: string,
  focal?: { focalX: number; focalY: number },
  watermark = true,
) => {
  if (!fs.existsSync(file)) return null
  const filename = path.basename(file)
  const { docs } = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })
  if (docs[0]) {
    // A different local file under the same name (e.g. a sharper logo) replaces the upload.
    const replaced = docs[0].filesize !== fs.statSync(file).size
    if (replaced || (consentNote && docs[0].consentNote !== consentNote)) {
      return payload.update({
        collection: 'media',
        id: docs[0].id,
        data: consentNote ? { consentNote } : {},
        ...(replaced ? { filePath: file, overwriteExistingFiles: true } : {}),
        context: ctx,
      })
    }
    return docs[0]
  }
  return payload.create({
    collection: 'media',
    data: { alt, consentNote, watermark, ...focal },
    filePath: file,
    context: ctx,
  })
}

const seed = async () => {
  const payload = await getPayload({ config })
  payload.logger.info('Seeding content…')

  // Logos: no watermark.
  const logo = await uploadIfPresent(
    payload,
    path.resolve(process.cwd(), 'assets/images/logo-blue.png'),
    '7FOR1 Foundation',
    undefined,
    undefined,
    false,
  )
  const logoWhite = await uploadIfPresent(
    payload,
    path.resolve(process.cwd(), 'assets/images/logo-white.png'),
    '7FOR1 Foundation',
    undefined,
    undefined,
    false,
  )

  await payload.updateGlobal({
    slug: 'site-settings',
    context: ctx,
    data: {
      email: 'info7for1@gmail.com',
      tagline: 'Action Over Sympathy',
      // One Google Form handles donations, volunteering and messages for now.
      donateUrl: FOUNDATION_FORM,
      volunteerUrl: FOUNDATION_FORM,
      contactUrl: FOUNDATION_FORM,
      social: {
        facebook: 'https://www.facebook.com/profile.php?id=61559432849309',
        linkedin: 'https://www.linkedin.com/company/7-for-1-foundation/',
        // instagram: no account yet
      },
      ...(logo ? { logo: logo.id } : {}),
      ...(logoWhite ? { logoWhite: logoWhite.id } : {}),
    },
  })

  const volunteersPhoto = await uploadIfPresent(
    payload,
    path.resolve(process.cwd(), 'assets/images/volunteers-bulu.jpg'),
    'Four 7FOR1 volunteers smiling in front of the Bulu Blind Health Centre sign',
    'Consent to publish confirmed by the foundation on 2026-11-11.',
    { focalX: 50, focalY: 30 },
  )
  const onlineSessionPhoto = await uploadIfPresent(
    payload,
    path.resolve(process.cwd(), 'assets/images/online-session.jpg'),
    'A laptop showing a remote presenter’s slide on no-tech assistive technology, such as tactile maps and the white cane',
    'Pending: consent from the remote presenters visible on the Zoom screen.',
  )

  await payload.updateGlobal({
    slug: 'home-page',
    context: ctx,
    data: {
      hero: {
        title: 'Training Africans with Disabilities in Digital Skills',
        text: 'We’re building a digitally inclusive Africa, starting in Cameroon. Seven For One trains people with disabilities in digital skills and works for inclusion that lasts.',
        primaryCta: { label: 'Volunteer with us', url: '/volunteer' },
      },
      whoWeAre: {
        heading: 'Who We Are',
        mission:
          'We train Africans with disabilities in digital skills, build accessible learning, and advocate for inclusion that lasts',
        vision:
          'An inclusive Africa where people with disabilities learn, work, and lead on equal terms in a digital world',
        cta: { label: 'Learn more', url: '/about' },
      },
      initiatives: { heading: 'Our Initiatives' },
      impact: {
        heading: 'Our Impact',
        stats: [
          { value: '18+', label: 'blind learners trained' },
          { value: '12+', label: 'young people trained in disability awareness' },
          { value: '3', label: 'initiatives launched' },
        ],
      },
      disability: {
        heading: 'Disability is not inability. Let’s act like it.',
        text: 'People with disabilities don’t need pity. They need access. Seven For One trains Africans with disabilities in digital skills, builds accessible learning, and opens real pathways to education, work, and independence.',
        cta: { label: 'Fund a training seat', url: '/donate' },
        image: volunteersPhoto?.id,
        insetImage: onlineSessionPhoto?.id,
        caption:
          'Our volunteers and remote presenters at the first 7FOR1 digital skills training. We only publish photos of participants who have agreed to it.',
      },
      more: {
        blogHeading: 'Our Blogs',
        newsletterHeading: 'Stay Connected',
        newsletterText:
          'Subscribe to our newsletter to receive updates on our work and opportunities to get involved',
      },
    },
  })

  const awarenessPhoto = await uploadIfPresent(
    payload,
    path.resolve(process.cwd(), 'assets/images/awareness-training.jpg'),
    'Participants and facilitators at a disability awareness and sensitivity training session',
    'Consent to publish confirmed by the foundation on 2026-11-11.',
  )

  const digitalSkillsPhoto = await uploadIfPresent(
    payload,
    path.resolve(process.cwd(), 'assets/images/digital-skills-laptop.jpg'),
    'A laptop at a 7FOR1 digital skills training, showing a remote presenter’s slide on no-tech assistive technology',
    'Pending: consent from the remote presenters visible on the Zoom screen.',
  )

  await upsertBySlug(payload, 'initiatives', 'digital-skills-training', {
    coverImage: digitalSkillsPhoto?.id,
    title: 'Digital Skills Training',
    type: 'core',
    summary:
      'Hands-on training for people with disabilities, building the digital skills they need to learn, work, and live independently.',
    goal: 'Give people with disabilities the digital skills they need to learn, work, and live independently.',
    ctaLabel: 'Explore our skills program',
    featured: true,
    sortOrder: 1,
  })

  const awareness = await upsertBySlug(payload, 'initiatives', 'disability-awareness-and-sensitivity-training', {
    title: 'Disability Awareness & Sensitivity Training',
    type: 'recurring',
    summary:
      'In October 2023, educators from VIFAL led a four-week training on inclusive teaching, disability rights, and cultural sensitivity. We now plan to run it frequently to build inclusive communities across Africa.',
    goal: 'Build inclusive communities across Africa by training educators and community members in inclusive teaching, disability rights, and cultural sensitivity.',
    ctaLabel: 'Explore our awareness program',
    coverImage: awarenessPhoto?.id,
    featured: true,
    sortOrder: 2,
  })

  const lessonAwayPhoto = await uploadIfPresent(
    payload,
    path.resolve(process.cwd(), 'assets/images/a-lesson-away.jpg'),
    'A facilitator speaking to children and adults seated at wooden desks in a classroom',
    'Consent to publish confirmed by the foundation on 2026-11-11.',
  )

  await upsertBySlug(payload, 'initiatives', 'a-lesson-away', {
    coverImage: lessonAwayPhoto?.id,
    title: 'A Lesson Away Initiative',
    type: 'sister',
    summary:
      'A separate initiative started by 7FOR1’s founder to help students affected by the crisis in the Northwest and Southwest return to school.',
    ctaLabel: 'Visit A Lesson Away',
    externalUrl: 'https://www.linkedin.com/company/lesson-away-initiative/',
    featured: true,
    sortOrder: 3,
  })

  await upsertBySlug(payload, 'projects', 'vifal-inclusive-teaching-training-2023', {
    title: 'Inclusive teaching training with VIFAL',
    initiative: awareness.id,
    status: 'completed',
    startDate: '2023-10-01T00:00:00.000Z',
    partners: 'VIFAL',
    summary:
      'A four-week training led by educators from VIFAL on inclusive teaching, disability rights, and cultural sensitivity.',
  })

  payload.logger.info('Done.')
  process.exit(0)
}

// Top-level await: `payload run` exits as soon as this module finishes loading.
await seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
