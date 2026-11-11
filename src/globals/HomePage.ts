import type { Field, GlobalConfig } from 'payload'

import { anyone, isStaff } from '../access'
import { validateLink, validateWebAddress } from '../fields/validate'
import { revalidateGlobal } from '../hooks/revalidate'

const link = (name: string, label: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', admin: { width: '50%' } },
        { name: 'url', type: 'text', validate: validateLink, admin: { width: '50%', description: 'A page on this site (/volunteer) or a full web address.' } },
      ],
    },
  ],
})

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page',
  admin: { group: 'Content' },
  access: { read: anyone, update: isStaff },
  hooks: { afterChange: [revalidateGlobal(['/'])] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          name: 'hero',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'text', type: 'textarea', required: true },
            { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Wide photo behind the headline.' } },
            link('primaryCta', 'Main button'),
            {
              name: 'videoUrl',
              type: 'text',
              validate: validateWebAddress,
              label: '“Watch our story” video link',
              admin: { description: 'e.g. a YouTube link. Leave empty to hide the button.' },
            },
          ],
        },
        {
          label: 'Who we are',
          name: 'whoWeAre',
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'Who We Are' },
            { name: 'mission', type: 'textarea', required: true },
            { name: 'vision', type: 'textarea', required: true },
            link('cta', 'Button'),
          ],
        },
        {
          label: 'Initiatives',
          name: 'initiatives',
          description:
            'The cards come from Content → Initiatives (those marked “featured”, in sort order).',
          fields: [{ name: 'heading', type: 'text', defaultValue: 'Our Initiatives' }],
        },
        {
          label: 'Impact',
          name: 'impact',
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'Our Impact' },
            {
              name: 'stats',
              type: 'array',
              maxRows: 6,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', type: 'text', required: true, admin: { width: '30%', description: 'e.g. 15+' } },
                    { name: 'label', type: 'text', required: true, admin: { width: '70%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Disability is not inability',
          name: 'disability',
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'text', type: 'textarea', required: true },
            link('cta', 'Button'),
            { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Landscape photo (about 5:3).' } },
            { name: 'insetImage', type: 'upload', relationTo: 'media', admin: { description: 'Optional smaller picture overlapping the main photo.' } },
            { name: 'caption', type: 'textarea' },
          ],
        },
        {
          label: 'Blog & newsletter',
          name: 'more',
          fields: [
            { name: 'blogHeading', type: 'text', defaultValue: 'Our Blogs' },
            { name: 'newsletterHeading', type: 'text', defaultValue: 'Stay Connected' },
            {
              name: 'newsletterText',
              type: 'textarea',
              defaultValue:
                'Subscribe to our newsletter to receive updates on our work and opportunities to get involved',
            },
          ],
        },
      ],
    },
  ],
}
