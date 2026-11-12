import type { Field } from 'payload'

import { validateHexColour, validateLink } from './validate'

const colour = (name: string, label: string, description: string): Field => ({
  name,
  label,
  type: 'text',
  validate: validateHexColour,
  admin: { description, width: '33%' },
})

/**
 * Extra content for a sister initiative's page, which takes on that
 * initiative's own branding until it has a website of its own.
 * Only shown in the admin when the initiative's type is "Sister Initiative".
 */
export const sisterPageField: Field = {
  name: 'sister',
  label: 'Sister initiative page',
  type: 'group',
  admin: {
    condition: (data) => data?.type === 'sister',
    description: 'This page uses the initiative’s own logo and colours. Leave a section empty to hide it.',
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Branding',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'logo', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'Square logo. Untick “Add watermark” when uploading it.' } },
            { name: 'tagline', type: 'text', admin: { width: '50%', description: 'e.g. “Bringing students back to school.”' } },
          ],
        },
        {
          type: 'row',
          fields: [
            colour('darkColour', 'Dark colour', 'Hero background (left side) and headings.'),
            colour('mainColour', 'Main colour', 'Hero background (right side) and links.'),
            colour('accentColour', 'Accent colour', 'Highlights and buttons. Darkened automatically where white text needs it.'),
          ],
        },
      ],
    },
    {
      name: 'stats',
      label: 'Key figures',
      type: 'array',
      labels: { singular: 'Figure', plural: 'Figures' },
      admin: { description: 'Three or four headline numbers. Only use figures the records support.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', required: true, admin: { width: '30%', description: 'e.g. 10' } },
            { name: 'label', type: 'text', required: true, admin: { width: '70%' } },
          ],
        },
      ],
    },
    {
      name: 'highlight',
      label: 'Milestone',
      type: 'group',
      admin: { description: 'A recent achievement shown prominently below the key figures. Leave the title empty to hide it.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', admin: { width: '30%', description: 'e.g. 2026 milestone' } },
            { name: 'title', type: 'text', admin: { width: '70%' } },
          ],
        },
        { name: 'text', type: 'textarea' },
        {
          type: 'row',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'Optional. Only with signed consent.' } },
            {
              name: 'imageCaption',
              type: 'text',
              admin: { width: '50%', description: 'Shown under the photo, e.g. “Shared with the consent of their guardians.”' },
            },
          ],
        },
      ],
    },
    {
      name: 'appeal',
      label: 'Current appeal',
      type: 'group',
      admin: { description: 'A call to donate for the current school year. Leave the title empty to hide it.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', admin: { width: '30%', description: 'e.g. 2025/26 school year' } },
            { name: 'title', type: 'text', admin: { width: '70%' } },
          ],
        },
        { name: 'text', type: 'textarea' },
        {
          name: 'figures',
          type: 'array',
          maxRows: 3,
          labels: { singular: 'Figure', plural: 'Figures' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'value', type: 'text', required: true, admin: { width: '30%', description: 'e.g. 13' } },
                { name: 'label', type: 'text', required: true, admin: { width: '70%' } },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'buttonLabel', type: 'text', admin: { width: '50%', description: 'e.g. Donate or get in touch' } },
            {
              name: 'buttonLink',
              type: 'text',
              validate: validateLink,
              defaultValue: '/contact',
              admin: { width: '50%', description: '/contact opens the contact form set in Site settings.' },
            },
          ],
        },
      ],
    },
    {
      name: 'quote',
      type: 'textarea',
      admin: { description: 'A short line shown as a large quotation, e.g. a guiding belief of the initiative.' },
    },
    {
      name: 'provides',
      label: 'What each child receives',
      type: 'array',
      labels: { singular: 'Item', plural: 'Items' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'steps',
      label: 'How it works',
      type: 'array',
      labels: { singular: 'Step', plural: 'Steps' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
      ],
    },
    {
      name: 'timeline',
      label: 'Year by year',
      type: 'array',
      labels: { singular: 'Year', plural: 'Years' },
      admin: { description: 'Most recent last. Add a new entry at the end of each school year.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'period', type: 'text', required: true, admin: { width: '30%', description: 'e.g. 2024/25' } },
            { name: 'title', type: 'text', required: true, admin: { width: '70%' } },
          ],
        },
        { name: 'text', type: 'textarea' },
        {
          name: 'photos',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
          maxRows: 4,
          admin: { description: 'Up to four. Only photos with signed consent from a parent or guardian.' },
        },
      ],
    },
    {
      name: 'funding',
      label: 'Where the money goes',
      type: 'group',
      admin: { description: 'One school year’s income and spending. Totals are added up for you.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'period', type: 'text', admin: { width: '33%', description: 'e.g. 2024/25' } },
            { name: 'raised', type: 'number', min: 0, admin: { width: '33%', description: 'Total donations received' } },
            { name: 'currency', type: 'text', defaultValue: 'FCFA', admin: { width: '33%' } },
          ],
        },
        {
          name: 'items',
          label: 'Spending',
          type: 'array',
          labels: { singular: 'Line', plural: 'Lines' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', required: true, admin: { width: '70%' } },
                { name: 'amount', type: 'number', required: true, min: 0, admin: { width: '30%' } },
              ],
            },
            { name: 'detail', type: 'text', admin: { description: 'Optional, e.g. “10 children, two instalments”' } },
          ],
        },
        { name: 'note', type: 'textarea', admin: { description: 'Optional, e.g. how fees are paid or what happens to any balance.' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'sponsorsText', label: 'Thank you to sponsors', type: 'textarea', admin: { width: '50%' } },
        { name: 'nextText', label: 'What’s next', type: 'textarea', admin: { width: '50%' } },
      ],
    },
    {
      name: 'nameNote',
      label: 'About our name',
      type: 'textarea',
      admin: { description: 'Optional, e.g. an earlier name people may still know the initiative by.' },
    },
  ],
}
