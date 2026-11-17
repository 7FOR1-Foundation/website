import type { GlobalConfig } from 'payload'

import { anyone, isStaff } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

/** The privacy policy at /privacy, linked from the footer, the sign-up form and every email. */
export const PrivacyPage: GlobalConfig = {
  slug: 'privacy-page',
  label: 'Privacy policy',
  admin: {
    group: 'Content',
    description: 'Update “Last updated” whenever you change the policy. Tell subscribers by email about important changes.',
  },
  access: { read: anyone, update: isStaff },
  hooks: { afterChange: [revalidateGlobal(['/privacy'])] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Privacy policy', admin: { width: '60%' } },
        {
          name: 'lastUpdated',
          label: 'Last updated',
          type: 'date',
          admin: { width: '40%', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' } },
        },
      ],
    },
    { name: 'body', type: 'richText' },
  ],
}
