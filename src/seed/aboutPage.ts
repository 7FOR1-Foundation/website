/**
 * Starting content for the About Us page, drawn from the association's
 * constitution (adopted 29/12/2024). After the first run, edit it in the admin
 * (Content → About page): this only fills the page while it is still empty,
 * unless `force` is passed.
 */
import path from 'path'
import type { Payload } from 'payload'

import { ctx, uploadIfPresent } from './helpers'

/** From the acknowledgement of receipt of declaration issued in Limbe on 17 April 2025. */
// Non-breaking spaces keep the reference on one line.
const DECLARATION_REF = 'No.\u00a0356/G.37/C54/VOL\u00a0I/SAAJP/A3'

export const LEGAL_STATUS_TEXT = [
  'Seven For One Association is a non-profit, apolitical and non-denominational association, legally declared under Law No. 90/053 of 19 December 1990 on freedom of association in Cameroon.',
  `Our declaration was acknowledged by the Senior Divisional Officer for Fako, Limbe, on 17 April 2025 (${DECLARATION_REF}). We are registered in Fako Division, with our headquarters in Buea Sub-Division, South West Region, and we can operate anywhere in Cameroon. A copy of the acknowledgement is available on request.`,
].join('\n\n')

export const LOCATION_TEXT =
  'Our headquarters are in Buea, South West Region. Most of our activities take place in Douala, and we work with people and partners anywhere in Cameroon.'

/** "Our story" as it was live before the founder's account was added (November 2026). */
export const PREVIOUS_STORY = [
  'People with disabilities don’t need pity. They need access. That belief, captured in our motto “Action Over Sympathy”, is why Seven For One exists.',
  'We began with practical steps. We trained blind learners in digital skills, with volunteers on the ground and presenters joining online. We also ran a four-week training with educators from VIFAL on inclusive teaching, disability rights, and cultural sensitivity. Our sister initiative, A Lesson Away, has helped children affected by the crisis in the Northwest and Southwest return to school since 2022.',
  'Today, Seven For One is a registered association with its own constitution, officially registered on 17 April 2025. We are working toward an Africa where people with disabilities learn, work, and lead on equal terms, and where every child grows up knowing that inclusion is normal.',
].join('\n\n')

/** "Our story", opening with the founder's own account. A paragraph in quotation marks is shown as a quote. */
export const STORY = [
  'Seven For One began with a simple belief: no one should be shut out of opportunity because of something they didn’t choose.',
  'For our founder, Mantoh Nasah Kuma, that belief is personal:',
  '“Digital skills transformed my life and my wellbeing, and I’ve always believed everyone deserves that chance. In 2024, at WordPress Accessibility Day, I made a friend from the Philippines who is blind and teaches programming and web development. I was amazed, because in Cameroon blind people are rarely found in rooms like that. I went through school without a single blind or disabled classmate. I wanted to change that.”',
  'So we started with practical steps. We trained blind learners in digital skills, with volunteers on the ground and presenters joining online. We ran a four-week course with educators from VIFAL on inclusive teaching, disability rights and cultural sensitivity. And we built on work that began in 2022 with our sister initiative, A Lesson Away, which helps children affected by the crisis in the North-West and South-West regions return to school.',
  'Today, Seven For One is a registered association with its own constitution, officially registered on 17 April 2025. We are working toward an Africa where people with disabilities learn, work and lead on equal terms, and where every child grows up knowing that inclusion is normal.',
].join('\n\n')

/** Ways to volunteer: guest posts by experts (credited under Content → Authors). */
export const WRITE_FOR_US = {
  title: 'Write for our blog',
  text: 'Are you a lawyer, health professional, teacher, employer or assistive technology user? Share what you know in a guest post on topics such as disability rights, health, inclusive education or accessible work. We credit you as the author. Use the Volunteer button below to get in touch.',
}

/**
 * Why our work is urgent (November 2026). Uses the UN's and Human Rights Watch's
 * neutral name for the crisis; every figure has a source in \`sources\`.
 */
export const WHY_NOW = {
  heading: 'Why now',
  text: [
    'In Cameroon, people with disabilities were already shut out of school, work and community life. In the North-West and South-West regions, the crisis has turned that exclusion into an emergency.',
    'When attacks forced families to flee, people with disabilities were often left behind, because relatives or carers could not take them along. Few received help afterwards. UNICEF reports that the prolonged crisis has made it even harder for children with disabilities to go to school.',
    'We are registered in Buea, in the South-West, and our sister initiative A Lesson Away works with children in Bamenda, in the North-West. We focus on what lasts: education and access. We help children affected by the crisis return to school, and we teach digital skills that let people learn, work and stay connected, even when moving around is unsafe.',
    'Every year a child spends out of school, and every year an adult spends cut off, is hard to win back. That is why we act now.',
  ].join('\n\n'),
  highlight: {
    value: '9 of 45',
    text: 'people with disabilities interviewed about the crisis had received any humanitarian assistance.',
    source: 'Human Rights Watch, August 2019',
  },
  sources: [
    {
      label:
        'Human Rights Watch: Cameroon: People With Disabilities Caught in Crisis (August 2019)',
      url: 'https://www.hrw.org/news/2019/08/05/cameroon-people-disabilities-caught-crisis',
    },
    {
      label: 'UNICEF Cameroon: Inclusive education in crisis (July 2026)',
      url: 'https://www.unicef.org/cameroon/stories/inclusive-education-crisis-cameroon-adriel-kimberly',
    },
  ],
}

export const PHILOSOPHY = {
  heading: 'Action Over Sympathy',
  text: [
    'People with disabilities deserve more than sympathy. They deserve access, opportunity, independence and the freedom to take part fully in society.',
    'Inclusion takes practical action: removing barriers, building skills, challenging misconceptions and creating opportunities. We don’t just speak up for inclusion. We work to make it happen.',
  ].join('\n\n'),
}

/** Stored in the `objectives` field (its earlier name); shown as “Our approach”. */
export const APPROACH = {
  heading: 'Our approach',
  intro: 'We turn our mission into action in four ways, through long-running initiatives.',
  items: [
    {
      title: 'Build digital skills',
      text: 'We teach people with disabilities to use computers, phones and the internet with confidence, in sessions designed around how they learn.',
    },
    {
      title: 'Make learning accessible',
      text: 'We create learning materials for different kinds of disability and promote assistive technology such as screen readers.',
    },
    {
      title: 'Open pathways to work',
      text: 'We build market-ready skills, connect learners with mentors and partner with businesses that can offer jobs.',
    },
    {
      title: 'Change attitudes',
      text: 'We work with communities, schools and educators so inclusion becomes normal, and speak up for digital accessibility in policy and employment.',
    },
  ],
}

export const PARTNERS = {
  heading: 'Our partners',
  intro: 'Organisations we work with to make inclusion happen.',
}

export const BOARD_INTRO =
  'Seven For One is governed by its General Assembly of members, which elects an Executive Board for a two-year term. Our constitution was adopted on 29 December 2024.'

/** Site settings → Legal registration: the footer line and the date given to search engines. */
export const REGISTRATION = {
  note: `Non-profit association legally declared in Cameroon, ${DECLARATION_REF}`,
  // Midday in Cameroon, so the day is the same in every time zone around Africa and Europe.
  date: '2025-04-17T11:00:00.000Z',
}

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
      philosophy: PHILOSOPHY,
      whyNow: WHY_NOW,
      intro: {
        title: 'About Us',
        text: 'Seven For One Association (7FOR1) is a non-governmental organisation on a mission to empower Africans with disabilities through digital skills training and initiatives that promote their inclusion in society.',
      },
      story: {
        heading: 'Our story',
        text: STORY,
        ...(volunteersPhoto ? { image: volunteersPhoto.id } : {}),
        imageCaption: 'Some of our volunteers.',
      },
      values: {
        heading: 'Our values',
        items: [
          {
            title: 'Action over sympathy',
            icon: 'action',
            text: 'We open doors to skills, work and independence. We don’t offer pity.',
          },
          {
            title: 'Dignity and equality',
            icon: 'equality',
            text: 'Every person has equal rights, whatever their disability, race, sex, religion or language.',
          },
          {
            title: 'Accessibility first',
            icon: 'accessibility',
            text: 'Our training, materials and events are designed for every kind of disability from the start, not adapted as an afterthought.',
          },
          {
            title: 'Inclusion starts early',
            icon: 'growth',
            text: 'We teach children that inclusion is normal, so the next generation grows up without the stereotypes.',
          },
          {
            title: 'Accountability',
            icon: 'accountability',
            text: 'We report on what we raise and spend, and we measure our results so we keep improving.',
          },
          {
            title: 'Partnership',
            icon: 'partnership',
            text: 'We work with families, schools, businesses and tech companies, because inclusion needs everyone.',
          },
        ],
      },
      // Members are added in the admin, each with their consent.
      board: {
        heading: 'Our Executive Board',
        intro: BOARD_INTRO,
      },
      objectives: APPROACH,
      partners: PARTNERS,
      location: {
        heading: 'Where we are',
        text: LOCATION_TEXT,
      },
      legal: {
        heading: 'Legal status',
        text: LEGAL_STATUS_TEXT,
      },
      volunteering: {
        heading: 'Ways to volunteer',
        count: '10+',
        intro:
          'You don’t need special qualifications. If you have some time and care about inclusion, there’s a way for you to help.',
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
          WRITE_FOR_US,
        ],
      },
      closing: {
        heading: 'Join us',
        text: 'Volunteer your time and skills, fund a training seat, or get in touch to partner with us.',
      },
    },
  })
}
