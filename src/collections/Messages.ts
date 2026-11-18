import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access'
import {
  availabilityOptions,
  contactReasons,
  messageTypes,
  toOptions,
  volunteerLocations,
  volunteerModes,
} from '../fields/formOptions'

const only = (type: string) => (data: Record<string, unknown>) => data?.type === type

/**
 * Everything sent through the Contact, Volunteer and Donate forms. Written only
 * by the site's server actions (never the open API) and readable by admins only,
 * since it holds personal details. Kept for at most two years (privacy policy).
 */
export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Message', plural: 'Messages' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'status', 'createdAt'],
    group: 'People',
    description:
      'Sent through the Contact, Volunteer and Donate forms. You also get each one by email.',
    listSearchableFields: ['name', 'email'],
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: toOptions(messageTypes),
          admin: { width: '50%', readOnly: true },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'new',
          options: [
            { label: 'New', value: 'new' },
            { label: 'Replied', value: 'replied' },
            { label: 'Done', value: 'done' },
          ],
          admin: { width: '50%', description: 'For your own follow-up.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '33%' } },
        { name: 'email', type: 'email', required: true, admin: { width: '33%' } },
        { name: 'phone', label: 'Phone / WhatsApp', type: 'text', admin: { width: '34%' } },
      ],
    },
    // Contact
    {
      name: 'reason',
      type: 'select',
      options: toOptions(contactReasons),
      admin: { condition: only('contact') },
    },
    { name: 'organisation', type: 'text', admin: { condition: only('contact') } },
    // Volunteer
    {
      name: 'location',
      label: 'Where they are',
      type: 'select',
      options: toOptions(volunteerLocations),
      admin: { condition: only('volunteer') },
    },
    {
      name: 'ways',
      label: 'How they’d like to help',
      type: 'text',
      hasMany: true,
      admin: { condition: only('volunteer') },
    },
    {
      name: 'skills',
      label: 'Skills or experience',
      type: 'textarea',
      admin: { condition: only('volunteer') },
    },
    {
      name: 'availability',
      type: 'select',
      hasMany: true,
      options: toOptions(availabilityOptions),
      admin: { condition: only('volunteer') },
    },
    {
      name: 'mode',
      label: 'In person or online',
      type: 'select',
      options: toOptions(volunteerModes),
      admin: { condition: only('volunteer') },
    },
    {
      name: 'accessNeeds',
      label: 'Anything that helps them take part fully',
      type: 'textarea',
      admin: { condition: only('volunteer') },
    },
    {
      name: 'adult',
      label: 'Confirmed 18 or older',
      type: 'checkbox',
      admin: { condition: only('volunteer') },
    },
    // Donation
    {
      name: 'campaign',
      label: 'Would like to support',
      type: 'text',
      admin: { condition: only('donation') },
    },
    {
      name: 'amount',
      label: 'Approximate amount',
      type: 'text',
      admin: { condition: only('donation') },
    },
    {
      name: 'thankPublicly',
      label: 'Happy to be thanked publicly by name',
      type: 'checkbox',
      admin: { condition: only('donation') },
    },
    // All
    { name: 'message', type: 'textarea' },
    {
      type: 'row',
      fields: [
        {
          name: 'consentAt',
          label: 'Agreed to the privacy policy',
          type: 'date',
          admin: { width: '50%', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'notified',
          label: 'Emailed to the team',
          type: 'checkbox',
          admin: { width: '50%', readOnly: true },
        },
      ],
    },
    {
      name: 'notes',
      label: 'Your notes',
      type: 'textarea',
      admin: { description: 'Private. Only admins see this.' },
    },
  ],
  timestamps: true,
}
