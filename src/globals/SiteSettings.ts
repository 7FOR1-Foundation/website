import type { GlobalConfig } from 'payload'

import { anyone, isStaff } from '../access'
import { validateLink, validateWebAddress } from '../fields/validate'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: isStaff },
  hooks: { afterChange: [revalidateGlobal(['layout:/'])] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'logo', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'Colour logo for the header.' } },
        { name: 'logoWhite', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'White logo for the footer.' } },
      ],
    },
    { name: 'tagline', type: 'text', defaultValue: 'Action Over Sympathy' },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true, defaultValue: 'info7for1@gmail.com', admin: { width: '50%' } },
        {
          name: 'phone',
          type: 'text',
          admin: { width: '50%', description: 'Leave empty to hide the phone number on the site.' },
        },
      ],
    },
    {
      name: 'social',
      type: 'group',
      label: 'Social links',
      admin: { description: 'Only the links you fill in are shown.' },
      fields: [
        { name: 'facebook', type: 'text', validate: validateWebAddress },
        // Hidden until the foundation has an Instagram account (the footer link is commented out too).
        { name: 'instagram', type: 'text', validate: validateWebAddress, admin: { hidden: true } },
        { name: 'linkedin', type: 'text', label: 'LinkedIn', validate: validateWebAddress },
      ],
    },
    {
      type: 'collapsible',
      label: 'Button and form links',
      admin: {
        description:
          'Where the Donate, Volunteer and Contact buttons and menu items go, e.g. a Google Form. Leave a field empty to use the site’s own “coming soon” page.',
      },
      fields: [
        { name: 'donateUrl', type: 'text', validate: validateLink, label: 'Donate link' },
        { name: 'volunteerUrl', type: 'text', validate: validateLink, label: 'Volunteer link' },
        { name: 'contactUrl', type: 'text', validate: validateLink, label: 'Contact link' },
      ],
    },
  ],
}
