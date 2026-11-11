import type { CollectionConfig } from 'payload'

import { anyone, isStaff, isStaffField } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: {
    read: anyone,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe the image for people using screen readers, e.g. “Trainer helping a student use a screen reader”.',
      },
    },
    {
      name: 'consentNote',
      type: 'text',
      // Internal record only: never exposed through the public API.
      access: { read: isStaffField },
      admin: {
        description:
          'If identifiable participants appear in this photo, note who gave consent and when.',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'card', width: 768 },
      { name: 'wide', width: 1600 },
    ],
  },
}
