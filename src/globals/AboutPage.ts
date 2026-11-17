import type { GlobalConfig } from 'payload'

import { anyone, isStaff } from '../access'
import { validateWebAddress } from '../fields/validate'
import { valueIconOptions } from '../fields/valueIcons'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * The About Us page. The mission and vision are not repeated here: they come
 * from Home page → Who we are, so they only need editing in one place.
 * Leave a section empty to hide it.
 */
export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About page',
  admin: {
    group: 'Content',
    description: 'The mission and vision on this page come from Home page → Who we are. Leave a section empty to hide it.',
  },
  access: { read: anyone, update: isStaff },
  hooks: { afterChange: [revalidateGlobal(['/about'])] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Introduction',
          name: 'intro',
          fields: [
            { name: 'title', type: 'text', defaultValue: 'About Us' },
            { name: 'text', type: 'textarea', admin: { description: 'One or two sentences at the top of the page.' } },
          ],
        },
        {
          label: 'Our story',
          name: 'story',
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'Our story' },
            {
              name: 'text',
              type: 'textarea',
              admin: { description: 'Leave an empty line between paragraphs.', rows: 10 },
            },
            {
              type: 'row',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'Optional photo beside the story.' } },
                { name: 'imageCaption', type: 'text', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Values',
          name: 'values',
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'Our values' },
            {
              name: 'items',
              label: 'Values',
              type: 'array',
              maxRows: 8,
              labels: { singular: 'Value', plural: 'Values' },
              admin: { description: 'Four to six works best.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
                    {
                      name: 'icon',
                      type: 'select',
                      options: valueIconOptions,
                      admin: { width: '40%', description: 'Each icon has its own colour. Without one, the value is numbered.' },
                    },
                  ],
                },
                { name: 'text', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Board',
          name: 'board',
          description:
            'Add each member, then tick “Show on the website” only once they have agreed to be listed. The section stays hidden until at least one member is shown.',
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'Our Executive Board' },
            { name: 'intro', type: 'textarea' },
            {
              name: 'members',
              label: 'Members',
              type: 'array',
              labels: { singular: 'Member', plural: 'Members' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                    {
                      name: 'role',
                      type: 'text',
                      required: true,
                      admin: {
                        width: '50%',
                        description:
                          'Use the constitution’s titles: President / CEO, Secretary-General, Treasurer, Financial Secretary, Programs Officer, Technical Adviser.',
                      },
                    },
                  ],
                },
                { name: 'bio', type: 'textarea', admin: { description: 'Optional. One or two sentences.' } },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'linkedin',
                      label: 'LinkedIn',
                      type: 'text',
                      validate: validateWebAddress,
                      admin: { width: '50%', description: 'Optional. Their LinkedIn profile address.' },
                    },
                    {
                      name: 'show',
                      label: 'Show on the website',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: { width: '50%', description: 'Only after this person has agreed to be listed.' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Objectives',
          name: 'objectives',
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'What we work towards' },
            { name: 'intro', type: 'textarea' },
            {
              name: 'items',
              label: 'Objectives',
              type: 'array',
              labels: { singular: 'Objective', plural: 'Objectives' },
              admin: { description: 'Short, plain-language versions of the objectives in the constitution.' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Where we are',
          name: 'location',
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'Where we are' },
            { name: 'text', type: 'textarea', admin: { description: 'City and region only. Don’t publish a home address.' } },
          ],
        },
        {
          label: 'Legal status',
          name: 'legal',
          description: 'Shown beside “Where we are”. Never include ID card numbers or personal details.',
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'Legal status' },
            {
              name: 'text',
              type: 'textarea',
              admin: {
                description: 'How and when the association was legally declared. Leave an empty line between paragraphs. Leave empty to hide it.',
                rows: 6,
              },
            },
          ],
        },
        {
          label: 'Volunteering',
          name: 'volunteering',
          description: 'Ways people can help, shown just above “Join us”. Leave the list empty to hide it.',
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'Ways to volunteer' },
            { name: 'intro', type: 'textarea' },
            {
              name: 'roles',
              label: 'Ways to help',
              type: 'array',
              labels: { singular: 'Way to help', plural: 'Ways to help' },
              admin: { description: 'Only list the help you currently need.' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea', required: true, admin: { description: 'One or two sentences on what it involves.' } },
              ],
            },
          ],
        },
        {
          label: 'Closing',
          name: 'closing',
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'Join us' },
            {
              name: 'text',
              type: 'textarea',
              admin: { description: 'Shown above the Volunteer, Donate and Contact buttons (their links are set in Site settings).' },
            },
          ],
        },
      ],
    },
  ],
}
