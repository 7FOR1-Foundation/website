import type { CollectionConfig } from 'payload'

import { isStaff, publishedOrStaff } from '../access'
import { sisterPageField } from '../fields/sisterPage'
import { slugField } from '../fields/slug'
import { validateWebAddress } from '../fields/validate'
import { revalidateCollection, revalidateOnDelete } from '../hooks/revalidate'

const paths = (doc: Record<string, unknown>) => ['/', '/initiatives', `/initiatives/${doc.slug}`]

export const Initiatives: CollectionConfig = {
  slug: 'initiatives',
  labels: { singular: 'Initiative', plural: 'Initiatives' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'featured', 'sortOrder', '_status'],
    group: 'Content',
    description:
      'An initiative is a long-running goal (e.g. Digital Skills Training). Add the projects carried out for it under Projects.',
  },
  defaultSort: 'sortOrder',
  versions: { drafts: true },
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: {
    afterChange: [revalidateCollection(paths)],
    afterDelete: [revalidateOnDelete(paths)],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'core',
      options: [
        { label: 'Core Program', value: 'core' },
        { label: 'Recurring Program', value: 'recurring' },
        { label: 'Sister Initiative', value: 'sister' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 240,
      admin: { description: 'One or two sentences shown on the home page card.' },
    },
    {
      name: 'goal',
      type: 'textarea',
      admin: { description: 'What this initiative is trying to achieve. Shown at the top of its page.' },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText', label: 'Full description' },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Card button label',
          admin: { description: 'Button on the home page card, e.g. “Explore our skills program”', width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'externalUrl',
          type: 'text',
          validate: validateWebAddress,
          label: 'Own website or social page',
          admin: {
            description: 'Shown as a button on the initiative’s page (e.g. A Lesson Away’s LinkedIn).',
            width: '50%',
          },
        },
        {
          name: 'externalLabel',
          type: 'text',
          label: 'Its button label',
          admin: { description: 'e.g. “Follow on LinkedIn”', width: '50%' },
        },
      ],
    },
    sisterPageField,
    {
      name: 'projects',
      type: 'join',
      collection: 'projects',
      on: 'initiative',
      admin: { defaultColumns: ['title', 'status', 'startDate'] },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Show on the home page.' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 99,
      admin: { position: 'sidebar', description: 'Lower numbers appear first. New initiatives start at 99, after the others.' },
    },
    {
      name: 'status',
      label: 'Activity',
      type: 'select',
      enumName: 'enum_initiatives_activity',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
