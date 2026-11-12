import type { CollectionConfig } from 'payload'

import { anyone, isStaff, isStaffField } from '../access'
import { watermarkUpload } from '../hooks/watermark'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  hooks: { beforeOperation: [watermarkUpload] },
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
      name: 'watermark',
      label: 'Add watermark',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description:
          'Stamps “© 7FOR1 Foundation” on the photo when it is uploaded. Untick only for logos and graphics. Applies to new uploads.',
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
    // Never keep full-resolution originals online: every upload is scaled down
    // to fit within 1600 x 1600 px (sharp on screen, poor for printing or reuse).
    resizeOptions: { width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true },
    focalPoint: true,
    imageSizes: [
      { name: 'card', width: 768 },
      { name: 'wide', width: 1600 },
    ],
  },
}
