import type { CollectionConfig } from 'payload'

import { isStaff, publishedOrStaff } from '../access'
import { readerNotes } from '../fields/readerNotes'
import { slugField } from '../fields/slug'
import { emailOnPublish } from '../hooks/emailOnPublish'
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
    afterChange: [revalidateCollection(paths), emailOnPublish],
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
    {
      name: 'authors',
      label: 'Written by',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Leave empty to credit Seven For One Association. Add people under Content → Authors.',
      },
    },
    {
      name: 'readerNote',
      label: 'Note to readers',
      type: 'select',
      admin: {
        position: 'sidebar',
        description: 'Shown at the end of the post. Use “Legal” or “Health” when an expert gives general guidance.',
      },
      options: Object.entries(readerNotes).map(([value, { label }]) => ({ value, label })),
    },
    {
      name: 'emailSubscribers',
      label: 'Email subscribers about this post',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Sends one email (title, summary, “Read the full post”) to the newsletter list when the post is published. Sent only once.',
        condition: (data) => !data?.emailedAt,
      },
    },
    {
      name: 'emailedAt',
      label: 'Emailed to subscribers',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true, condition: (data) => Boolean(data?.emailedAt) },
    },
    {
      name: 'readerNoteText',
      label: 'Your note',
      type: 'textarea',
      admin: { position: 'sidebar', condition: (_, siblingData) => siblingData?.readerNote === 'custom' },
    },
  ],
}
