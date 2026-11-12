/** Shared helpers for the seed scripts. */
import fs from 'fs'
import path from 'path'
import type { Payload } from 'payload'

// A fresh object for every operation: Payload plugins write flags into the
// request context (the storage plugin sets "skipCloudStorage" after an upload),
// so sharing one object would stop every upload after the first.
export const ctx = () => ({ disableRevalidate: true })

export const FOUNDATION_FORM =
  'https://docs.google.com/forms/d/e/1FAIpQLSegSSPllfUxddHCX7FFpwHiXc1ivawt1FwSMuY7xWS0FlWGJw/viewform'

export const upsertBySlug = async <T extends 'initiatives' | 'projects'>(
  payload: Payload,
  collection: T,
  slug: string,
  data: Record<string, unknown>,
) => {
  const { docs } = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, draft: true })
  const body = { ...data, slug, _status: 'published' } as never
  if (docs[0]) return payload.update({ collection, id: docs[0].id, data: body, context: ctx() })
  return payload.create({ collection, data: body, context: ctx() })
}

export const uploadIfPresent = async (
  payload: Payload,
  file: string,
  alt: string,
  consentNote?: string,
  focal?: { focalX: number; focalY: number },
  watermark = true,
) => {
  if (!fs.existsSync(file)) return null
  const filename = path.basename(file)
  // Payload may store "photo.jpg" as "photo-1.jpg" when that name is already
  // taken in the local media folder, so match either form (earliest first).
  const ext = path.extname(filename)
  const stem = filename.slice(0, -ext.length)
  const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const sameFile = new RegExp(`^${escape(stem)}(-\\d+)?${escape(ext)}$`)
  const { docs: candidates } = await payload.find({
    collection: 'media',
    where: { filename: { like: stem } },
    sort: 'createdAt',
    limit: 50,
    pagination: false,
  })
  const docs = candidates.filter((doc) => doc.filename && sameFile.test(doc.filename))
  if (docs[0]) {
    // A different local file under the same name (e.g. a sharper logo) replaces the upload.
    const replaced = docs[0].filesize !== fs.statSync(file).size
    if (replaced || (consentNote && docs[0].consentNote !== consentNote)) {
      return payload.update({
        collection: 'media',
        id: docs[0].id,
        data: { watermark, ...(consentNote ? { consentNote } : {}) },
        ...(replaced ? { filePath: file, overwriteExistingFiles: true } : {}),
        context: ctx(),
      })
    }
    return docs[0]
  }
  return payload.create({
    collection: 'media',
    data: { alt, consentNote, watermark, ...focal },
    filePath: file,
    context: ctx(),
  })
}

/** Plain paragraphs in the rich-text editor's format. */
export const paragraphs = (...texts: string[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: texts.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      textFormat: 0,
      children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
    })),
  },
})
