import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access'

/**
 * Newsletter sign-ups. The public form writes here through a server action
 * (never the open API). Double opt-in by email arrives with the Brevo setup.
 */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'source', 'createdAt'],
    group: 'People',
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    { name: 'name', type: 'text' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending confirmation', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
    },
    { name: 'source', type: 'text', admin: { description: 'Where on the site they signed up.' } },
    { name: 'consentAt', type: 'date', admin: { readOnly: true } },
  ],
  timestamps: true,
}
