import type { CollectionConfig, PayloadRequest } from 'payload'

import { anyone, isStaff } from '../access'
import { validateWebAddress } from '../fields/validate'
import { revalidatePaths } from '../hooks/revalidate'

/** Refreshes the blog pages that credit this author. */
const refreshTheirPosts = async ({ doc, req }: { doc: { id: number }; req: PayloadRequest }) => {
  if (req.context?.disableRevalidate) return doc
  const { docs } = await req.payload.find({
    collection: 'posts',
    where: { authors: { in: [doc.id] } },
    depth: 0,
    limit: 200,
    req,
  })
  await revalidatePaths(['/', '/blog', ...docs.map((post) => `/blog/${post.slug}`)], req)
  return doc
}

/**
 * People credited on blog posts, such as guest experts (a lawyer, a teacher, a
 * doctor). Only add someone once they have agreed, in writing, to have their
 * name, title and photo published.
 */
export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: { singular: 'Author', plural: 'Authors' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'credentials', 'updatedAt'],
    group: 'Content',
    description:
      'Guest experts and team members who write blog posts. Add someone only after they have agreed (an email is enough) to have their name, title and photo on the site.',
  },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [refreshTheirPosts], afterDelete: [refreshTheirPosts] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'credentials',
          label: 'Title or profession',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Shown next to their name, e.g. “Lawyer, Cameroon Bar Association” or “Special-needs teacher”.',
          },
        },
      ],
    },
    {
      name: 'bio',
      type: 'textarea',
      maxLength: 500,
      admin: { description: 'Optional. Two or three sentences on their experience, shown at the end of their posts.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          admin: { width: '50%', description: 'Optional. A square head-and-shoulders photo works best. Untick the watermark when uploading.' },
        },
        {
          name: 'link',
          label: 'LinkedIn or website',
          type: 'text',
          validate: validateWebAddress,
          admin: { width: '50%', description: 'Optional. Lets readers check who they are.' },
        },
      ],
    },
  ],
  timestamps: true,
}
