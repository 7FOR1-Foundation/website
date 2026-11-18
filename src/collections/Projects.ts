import type { CollectionConfig } from 'payload'

import { isStaff, publishedOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { validateLink } from '../fields/validate'
import { revalidateCollection, revalidateOnDelete } from '../hooks/revalidate'

/** The initiative field may be an id or a populated document. */
const initiativeSlug = (doc: Record<string, unknown>): string | undefined => {
  const initiative = doc.initiative as { slug?: string } | number | string | undefined
  return typeof initiative === 'object' ? initiative?.slug : undefined
}

const paths = (doc: Record<string, unknown>) => {
  const list = ['/', `/projects/${doc.slug}`]
  const slug = initiativeSlug(doc)
  if (slug) list.push(`/initiatives/${slug}`)
  return list
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Project', plural: 'Projects' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'initiative', 'status', 'startDate', '_status'],
    group: 'Content',
    description: 'A project is one piece of work carried out for an initiative.',
  },
  defaultSort: '-startDate',
  versions: { drafts: true },
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: {
    afterChange: [
      async (args) => {
        // Look up the parent initiative's slug so its page refreshes too.
        const { doc, req } = args
        if (doc.initiative && typeof doc.initiative !== 'object') {
          const parent = await req.payload
            .findByID({ collection: 'initiatives', id: doc.initiative, depth: 0, req, draft: true })
            .catch(() => null)
          if (parent)
            return revalidateCollection(paths)({ ...args, doc: { ...doc, initiative: parent } })
        }
        return revalidateCollection(paths)(args)
      },
    ],
    afterDelete: [revalidateOnDelete(paths)],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'initiative',
      type: 'relationship',
      relationTo: 'initiatives',
      required: true,
      index: true,
      admin: { position: 'sidebar', description: 'The initiative this project works towards.' },
    },
    {
      name: 'status',
      label: 'Progress',
      type: 'select',
      enumName: 'enum_projects_progress',
      required: true,
      defaultValue: 'planned',
      options: [
        { label: 'Planned', value: 'planned' },
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Completed', value: 'completed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'location',
          type: 'text',
          admin: { width: '50%', description: 'e.g. Buea, Cameroon' },
        },
        {
          name: 'peopleReached',
          type: 'number',
          min: 0,
          admin: { width: '50%', description: 'How many people took part or benefited.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'timing',
          label: 'When',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Shown when the exact dates aren’t set yet, e.g. “2027” or “Early 2027”.',
          },
        },
        {
          name: 'audience',
          label: 'Who it’s for',
          type: 'text',
          admin: {
            width: '50%',
            description: 'e.g. “At least 10 blind and visually impaired people in Buea”.',
          },
        },
      ],
    },
    {
      name: 'partners',
      type: 'text',
      admin: {
        description: 'Organisations you worked with. Only name them once they have agreed.',
      },
    },
    {
      type: 'collapsible',
      label: 'Funding and button',
      admin: {
        description: 'Optional. Shown beside the write-up, with an approximate US dollar figure.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'fundingGoal',
              label: 'Budget (FCFA)',
              type: 'number',
              min: 0,
              admin: { width: '50%' },
            },
            {
              name: 'fundingRaised',
              label: 'Raised so far (FCFA)',
              type: 'number',
              min: 0,
              admin: { width: '50%', description: 'Leave empty until fundraising has started.' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ctaLabel',
              label: 'Button label',
              type: 'text',
              admin: { width: '50%', description: 'e.g. “Support this project”.' },
            },
            {
              name: 'ctaLink',
              label: 'Button link',
              type: 'text',
              validate: validateLink,
              admin: { width: '50%', description: 'e.g. /donate' },
            },
          ],
        },
      ],
    },
    { name: 'summary', type: 'textarea', required: true, maxLength: 280 },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText', label: 'Write-up' },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
  ],
}
