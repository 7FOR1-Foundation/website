/**
 * Starting content for the About Us page, drawn from the association's
 * constitution (adopted 29/12/2024). After the first run, edit it in the admin
 * (Content → About page): this only fills the page while it is still empty,
 * unless `force` is passed.
 */
import path from 'path'
import type { Payload } from 'payload'

import { ctx, uploadIfPresent } from './helpers'

export const seedAboutPage = async (payload: Payload, { force = false } = {}) => {
  const existing = await payload.findGlobal({ slug: 'about-page', depth: 0 })
  if (existing.intro?.text && !force) {
    payload.logger.info('The About page already has content; leaving it as it is.')
    return
  }

  // Already uploaded for the home page; found by file name rather than uploaded again.
  const volunteersPhoto = await uploadIfPresent(
    payload,
    path.resolve(process.cwd(), 'assets/images/volunteers-bulu.jpg'),
    'Four 7FOR1 volunteers smiling in front of the Bulu Blind Health Centre sign',
    'Consent to publish confirmed by the foundation on 2026-11-11.',
    { focalX: 50, focalY: 30 },
  )

  await payload.updateGlobal({
    slug: 'about-page',
    context: ctx(),
    data: {
      intro: {
        title: 'About Us',
        text: 'Seven For One Association (7FOR1) is a non-governmental organisation on a mission to empower Africans with disabilities through digital skills training and initiatives that promote their inclusion in society.',
      },
      story: {
        heading: 'Our story',
        text: [
          'People with disabilities don’t need pity. They need access. That belief, captured in our motto “Action Over Sympathy”, is why Seven For One exists.',
          'We began with practical steps. We trained blind learners in digital skills, with volunteers on the ground and presenters joining online. We also ran a four-week training with educators from VIFAL on inclusive teaching, disability rights, and cultural sensitivity. Our sister initiative, A Lesson Away, has helped children affected by the crisis in the Northwest and Southwest return to school since 2022.',
          'Today, Seven For One is a registered association with its own constitution, officially registered on 14 April 2025. We are working toward an Africa where people with disabilities learn, work, and lead on equal terms, and where every child grows up knowing that inclusion is normal.',
        ].join('\n\n'),
        ...(volunteersPhoto ? { image: volunteersPhoto.id } : {}),
        imageCaption: 'Some of our volunteers.',
      },
      values: {
        heading: 'Our values',
        items: [
          {
            title: 'Action over sympathy',
            text: 'We open doors to skills, work and independence. We don’t offer pity.',
          },
          {
            title: 'Dignity and equality',
            text: 'Every person has equal rights, whatever their disability, race, sex, religion or language.',
          },
          {
            title: 'Accessibility first',
            text: 'Our training, materials and events are designed for every kind of disability from the start, not adapted as an afterthought.',
          },
          {
            title: 'Inclusion starts early',
            text: 'We teach children that inclusion is normal, so the next generation grows up without the stereotypes.',
          },
          {
            title: 'Accountability',
            text: 'We report on what we raise and spend, and we measure our results so we keep improving.',
          },
          {
            title: 'Partnership',
            text: 'We work with families, schools, businesses and tech companies, because inclusion needs everyone.',
          },
        ],
      },
      // Members are added in the admin, each with their consent.
      board: {
        heading: 'Our Executive Board',
        intro: 'Our board members are elected by our General Assembly for a two-year term.',
      },
      objectives: {
        heading: 'What we work towards',
        intro: 'From our constitution, in brief.',
        items: [
          { text: 'Train people with disabilities to use technology with confidence.' },
          { text: 'Create accessible learning materials for different kinds of disability.' },
          { text: 'Open pathways to work through market-ready skills, mentorship and partnerships with businesses.' },
          { text: 'Raise awareness in communities and schools, and teach children why inclusion matters.' },
          { text: 'Promote assistive technology and digital platforms that everyone can use.' },
          { text: 'Advocate for digital accessibility in policy, technology and employment, locally, nationally and globally.' },
          { text: 'Measure the results of our programmes and use them to improve.' },
          { text: 'Build a network of people and organisations working for disability inclusion in the digital world.' },
        ],
      },
      location: {
        heading: 'Where we are',
        text: 'We are based in Douala, Cameroon, where most of our activities take place. The association is registered in Buea, South West Region.',
      },
      volunteering: {
        heading: 'Ways to volunteer',
        intro: 'You don’t need special qualifications. If you have some time and care about inclusion, there’s a way for you to help.',
        roles: [
          {
            title: 'Support our trainings',
            text: 'Help run digital skills sessions: setting up, guiding learners one to one, and making sure everyone can follow.',
          },
          {
            title: 'Assistive technology',
            text: 'Share what you know about screen readers, accessible devices and software, or help us set them up for learners.',
          },
          {
            title: 'Outreach and awareness',
            text: 'Take part in visits to communities and schools, and help children and adults understand why inclusion matters.',
          },
          {
            title: 'Mentoring',
            text: 'Guide one of our participants as they build their skills and take their next steps towards work.',
          },
          {
            title: 'Fundraising and partnerships',
            text: 'Help us find sponsors, prepare funding applications, or introduce us to businesses that could offer jobs.',
          },
          {
            title: 'Communications',
            text: 'Write, take photos, design or manage social media, so more people hear about the work.',
          },
        ],
      },
      closing: {
        heading: 'Join us',
        text: 'Volunteer your time and skills, fund a training seat, or get in touch to partner with us.',
      },
    },
  })
}
