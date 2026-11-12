/**
 * A Lesson Away's page content, from the initiative's own records (reports,
 * budgets, summaries and updates from the team). Children are never named.
 *
 * Run on its own with `pnpm seed:ala` to update only this initiative and its
 * photos, leaving every other page and admin edit alone.
 */
import path from 'path'
import type { Payload } from 'payload'

import { paragraphs, uploadIfPresent, upsertBySlug } from './helpers'

export const seedALessonAway = async (payload: Payload) => {
  const lessonAwayPhoto = await uploadIfPresent(
    payload,
    path.resolve(process.cwd(), 'assets/images/a-lesson-away.jpg'),
    'A facilitator speaking to children and adults seated at wooden desks in a classroom',
    'Consent to publish confirmed by the foundation on 2026-11-11.',
  )

  // A Lesson Away: everything below comes from the initiative's own records
  // (2024/25 report and budget, summary, plans). Children are never named.
  const GUARDIAN_CONSENT = 'Consent from the children’s guardians to publish this photo, confirmed by the foundation on 2026-11-12.'
  const ala = async (file: string, alt: string, focal?: { focalX: number; focalY: number }) =>
    uploadIfPresent(payload, path.resolve(process.cwd(), `assets/images/${file}`), alt, GUARDIAN_CONSENT, focal)

  const alaLogo = await uploadIfPresent(
    payload,
    path.resolve(process.cwd(), 'assets/images/a-lesson-away-logo.png'),
    'A Lesson Away Initiative logo: an open book under a rising sun',
    undefined,
    undefined,
    false,
  )
  const alaLaunch = await ala('ala-2022-launch.jpg', 'Five young children standing in front of a classroom blackboard')
  const alaChildren = await ala('ala-2023-children.jpg', 'A group of smiling children standing together outdoors')
  const alaClassVolunteers = await ala(
    'ala-2023-class-volunteers.jpg',
    'Two volunteers in orange T-shirts standing with a group of children in front of a blackboard',
  )
  const alaClassSession = await ala(
    'ala-2023-class-session.jpg',
    'A volunteer speaking to children and adults seated at wooden desks in a classroom',
  )
  const alaGraduates = await uploadIfPresent(
    payload,
    path.resolve(process.cwd(), 'assets/images/ala-2026-graduates.jpg'),
    'Two A Lesson Away students in graduation gowns and caps at their primary school graduation',
    'Consent from both students’ guardians to publish this photo, confirmed by the foundation on 2026-11-12.',
    { focalX: 50, focalY: 35 },
  )
  const ids = (...docs: ({ id: number } | null)[]) => docs.filter((d): d is { id: number } => Boolean(d)).map((d) => d.id)

  await upsertBySlug(payload, 'initiatives', 'a-lesson-away', {
    coverImage: lessonAwayPhoto?.id,
    title: 'A Lesson Away Initiative',
    type: 'sister',
    summary:
      'A separate initiative started by 7FOR1’s founder to help students affected by the crisis in the Northwest and Southwest return to school.',
    goal: 'We help children affected by the crisis in Cameroon’s Northwest region, especially those facing disability or displacement, go back to school with dignity and support.',
    body: paragraphs(
      'Since the crisis in Cameroon’s Northwest and Southwest regions began in 2016, families have been displaced, schools have closed, and many children have lost a parent or seen a parent injured. The relatives who take these children in often cannot afford school fees.',
      'In many communities, public schools, the most affordable option, have stayed closed. That leaves community, private and mission schools, which cost more. Some children are sent to learn a trade or work in other homes when they should be in class.',
      'A Lesson Away pays school fees and provides school materials so these children can return to class, with a special focus on children with disabilities and those displaced by the crisis.',
    ),
    ctaLabel: 'Explore A Lesson Away',
    externalUrl: 'https://www.linkedin.com/company/lesson-away-initiative/',
    externalLabel: 'Follow on LinkedIn',
    featured: true,
    sortOrder: 3,
    sister: {
      logo: alaLogo?.id,
      tagline: 'Bringing students back to school.',
      darkColour: '#143F61',
      mainColour: '#1C78C3',
      accentColour: '#D86B26',
      stats: [
        { value: '16', label: 'students supported since 2022' },
        { value: '3', label: 'communities reached' },
        { value: '2', label: 'of our first students now in secondary school' },
      ],
      highlight: {
        label: '2026 milestone',
        title: 'Our first students are now in secondary school',
        text: 'Two of the five children who started with A Lesson Away in 2022 sat the First School Leaving Certificate (FSLC) and Common Entrance exams in 2025/26. Both passed, and both started secondary school this year, in 2026/27.',
        image: alaGraduates?.id,
        imageCaption: 'Our two graduates. Shared with the consent of their guardians.',
      },
      appeal: {
        label: '2026/27 school year',
        title: '13 students are in class this year. Help us see them through.',
        text: 'All 13 students have started the 2026/27 school year. Sponsors have already given 150,000 FCFA for their back-to-school costs, and every further contribution, large or small, helps keep them in school until the end of the year. Get in touch through our form to donate or to sponsor a child.',
        figures: [
          { value: '13', label: 'students in class for 2026/27' },
          { value: '150,000', label: 'FCFA raised so far for back to school' },
        ],
        buttonLabel: 'Donate or sponsor a child',
        buttonLink: '/contact',
      },
      quote: 'Every student we’ve reached represents a family that chose to keep going.',
      provides: [
        { item: 'School fees, paid directly to the school' },
        { item: 'Exercise books and textbooks' },
        { item: 'A uniform and a school bag' },
        { item: 'Regular follow-up and emotional support from trained volunteers' },
      ],
      steps: [
        { title: 'Identify', text: 'Volunteers find children in need through community outreach, word of mouth and social media.' },
        { title: 'Assess', text: 'We meet each child’s parent or guardian to understand the child’s school and emotional needs.' },
        {
          title: 'Provide',
          text: 'We pay school fees directly to the school, in instalments, and provide the books and materials each child needs.',
        },
        {
          title: 'Follow up',
          text: 'Volunteers keep in touch with families and schools. Support is renewed each year for children who attend regularly and keep up in class.',
        },
      ],
      timeline: [
        {
          period: '2022',
          title: 'We start with 5 students',
          text: 'A Lesson Away began with 5 students at one partner primary school in Bamenda, paying their school fees month by month.',
          photos: ids(alaLaunch),
        },
        {
          period: '2023/24',
          title: 'Back in class',
          text: 'Volunteers met guardians to understand each child’s needs and visited the children at school.',
          photos: ids(alaChildren, alaClassVolunteers, alaClassSession),
        },
        {
          period: '2024/25',
          title: '10 children supported',
          text: 'Volunteers surveyed families in Bamenda and chose 10 children based on need. After meeting the school and the guardians, we paid 350,000 FCFA in fees directly to the school, in two instalments.',
        },
        {
          period: '2025/26',
          title: '15 students supported, and our first graduates',
          text: 'Sponsors gave about 400,000 FCFA, which paid school fees and bought books and pens for 15 students. Two students from our original 2022 group sat the FSLC and Common Entrance exams, and both passed.',
          photos: ids(alaGraduates),
        },
        {
          period: '2026/27',
          title: 'Our first students start secondary school',
          text: 'Our two graduates have started secondary school, and 13 students are in class with our support. Sponsors have given 150,000 FCFA for back to school so far.',
        },
      ],
      funding: {
        period: '2024/25',
        raised: 464000,
        currency: 'FCFA',
        items: [
          { label: 'School fees', amount: 350000, detail: 'Paid directly to the school for 10 children, in two instalments' },
          {
            label: 'Volunteer transport',
            amount: 49000,
            detail: 'Visiting families, the project launch, paying fees, and volunteer travel to Bamenda',
          },
          { label: 'Launch and admin', amount: 31000, detail: 'Badges, T-shirts, the project stamp and photocopies' },
        ],
        note: 'School fees are paid straight to the school, which gives a receipt for every payment. Any balance stays with the project for the next school year.',
      },
      sponsorsText:
        'In 2024/25, 10 individual sponsors gave a total of 464,000 FCFA, enough to cover every child’s school fees. Thank you to each one of them.',
      nextText:
        'As more of our students finish primary school, we are extending our support into secondary school, so that finishing primary is a beginning rather than the end of their education.',
      nameNote:
        'Some of our early sponsors and partners know this initiative through Learn & Bridge Foundation, the name we first planned for our foundation. We changed course as our goals grew, and because other organisations already had similar names. A Lesson Away is the same initiative, now a sister initiative of the 7FOR1 Foundation.',
    },
  })
}
