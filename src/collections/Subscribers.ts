import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access'

/**
 * Newsletter sign-ups. The public form writes here through a server action
 * (never the open API). Double opt-in: people get an email with a link and
 * are added to the Brevo list only once they confirm. Unsubscribing happens
 * in Brevo (the link in every newsletter), which then stops sending to them.
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
    {
      name: 'consentAt',
      label: 'Confirmed on',
      type: 'date',
      admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'brevoSynced',
      label: 'On the Brevo list',
      type: 'checkbox',
      defaultValue: false,
      admin: { readOnly: true, description: 'Ticked once added to the Brevo list. A weekly check retries any that failed.' },
    },
    // The confirmation link: only a hash is stored, so a database leak can't confirm anyone.
    { name: 'confirmTokenHash', type: 'text', index: true, admin: { hidden: true } },
    { name: 'confirmSentAt', type: 'date', admin: { hidden: true } },
  ],
  timestamps: true,
}
