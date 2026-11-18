import type { GlobalConfig } from 'payload'

import { anyone, isStaff } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * The Donate page: what we are raising money for, and a form for people who'd
 * like to give. No payment details are published; the team follows up personally.
 */
export const DonatePage: GlobalConfig = {
  slug: 'donate-page',
  label: 'Donate page',
  admin: {
    group: 'Content',
    description:
      'Amounts are in FCFA. The site adds an approximate US dollar amount using the rate in Site settings.',
  },
  access: { read: anyone, update: isStaff },
  hooks: { afterChange: [revalidateGlobal(['/donate'])] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Introduction',
          name: 'intro',
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Donate' },
            { name: 'text', type: 'textarea' },
          ],
        },
        {
          label: 'Campaigns',
          name: 'campaigns',
          description:
            'What we are raising money for now. Remove a campaign once it is fully funded, or keep it to show it reached its goal.',
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'What your gift supports' },
            {
              name: 'items',
              label: 'Campaigns',
              type: 'array',
              labels: { singular: 'Campaign', plural: 'Campaigns' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
                    {
                      name: 'label',
                      type: 'text',
                      admin: {
                        width: '40%',
                        description: 'A short tag, e.g. “Ongoing” or “Starting in 2027”.',
                      },
                    },
                  ],
                },
                { name: 'text', type: 'textarea', required: true },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'raised',
                      label: 'Raised so far (FCFA)',
                      type: 'number',
                      min: 0,
                      admin: {
                        width: '50%',
                        description: 'Leave empty if fundraising hasn’t started.',
                      },
                    },
                    {
                      name: 'goal',
                      label: 'Goal (FCFA)',
                      type: 'number',
                      min: 0,
                      admin: { width: '50%', description: 'Leave empty to hide the progress bar.' },
                    },
                  ],
                },
                {
                  name: 'needs',
                  label: 'What the money pays for',
                  type: 'array',
                  labels: { singular: 'Item', plural: 'Items' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'amount',
                          label: 'Amount (FCFA)',
                          type: 'number',
                          min: 0,
                          admin: { width: '30%' },
                        },
                        {
                          name: 'text',
                          label: 'For',
                          type: 'text',
                          required: true,
                          admin: { width: '70%' },
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'initiative',
                      label: 'Initiative page',
                      type: 'relationship',
                      relationTo: 'initiatives',
                      admin: { width: '50%', description: 'Optional. Adds a “Learn more” link.' },
                    },
                    { name: 'image', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Form',
          name: 'form',
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'I’d like to give' },
            {
              name: 'text',
              type: 'textarea',
              admin: { description: 'Explain what happens after someone sends the form.' },
            },
          ],
        },
      ],
    },
  ],
}
