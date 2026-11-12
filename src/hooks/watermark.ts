import type { CollectionBeforeOperationHook } from 'payload'
import sharp from 'sharp'

import { WATERMARK_PNG } from './watermark-image'

/** Watermark width as a share of the photo's width, and its distance from the edges. */
const MARK_SHARE = 0.28
const MARGIN_SHARE = 0.02

const WATERMARKABLE = new Set(['image/jpeg', 'image/png', 'image/webp'])

/**
 * Stamps "© 7FOR1 Foundation" in the bottom-right corner of every uploaded
 * photo, before Payload stores it and makes its smaller versions, so the
 * original file and every size carry the mark. Logos and other images can opt
 * out with the "Add watermark" checkbox.
 */
export const watermarkUpload: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if (operation !== 'create' && operation !== 'update') return args
  const file = req.file
  if (!file?.data || !WATERMARKABLE.has(file.mimetype)) return args
  const { data, id } = args as { data?: { watermark?: boolean }; id?: number | string }
  if (data?.watermark === false) return args
  // Replacing the file of an existing image without resending the checkbox:
  // keep that image's own setting (logos stay unmarked).
  if (operation === 'update' && data?.watermark === undefined && id !== undefined) {
    const existing = await req.payload.findByID({ collection: 'media', id, depth: 0, req }).catch(() => null)
    if (existing?.watermark === false) return args
  }

  // Apply the camera's orientation first, so the mark lands in the visible corner.
  const photo = sharp(file.data, { failOn: 'none' }).rotate()
  const { data: upright, info } = await photo.toBuffer({ resolveWithObject: true })

  const markWidth = Math.max(80, Math.round(info.width * MARK_SHARE))
  const mark = await sharp(WATERMARK_PNG).resize({ width: markWidth }).toBuffer({ resolveWithObject: true })
  const margin = Math.round(info.width * MARGIN_SHARE)

  const stamped = await sharp(upright)
    .composite([
      {
        input: mark.data,
        left: Math.max(0, info.width - mark.info.width - margin),
        top: Math.max(0, info.height - mark.info.height - margin),
      },
    ])
    .toFormat(info.format as 'jpeg' | 'png' | 'webp', { quality: 88 })
    .toBuffer()

  file.data = stamped
  file.size = stamped.length
  return args
}
