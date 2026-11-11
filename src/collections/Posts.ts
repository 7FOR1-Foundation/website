import type { CollectionConfig } from 'payload'

import { isStaff, publishedOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { revalidateCollection, revalidateOnDelete } from '../hooks/revalidate'

const paths = (doc: Record<string, unknown>) => ['/', '/blog', `/blog/${doc.slug}`]

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Blog post', plural: 'Blog posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status'],
    group: 'Content',
  },
  defaultSort: '-publishedAt',
  versions: { drafts: { schedulePublish: true } },
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: {
    afterChange: [revalidateCollection(paths)],
    afterDelete: [revalidateOnDelete(paths)],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) =>
            value ?? (siblingData?._status === 'published' ? new Date().toISOString() : value),
        ],
      },
    },
    { name: 'excerpt', type: 'textarea', required: true, maxLength: 280 },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
  ],
}
