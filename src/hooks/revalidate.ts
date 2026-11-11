import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

/**
 * Ask Next.js to rebuild the given pages after content changes, so edits in the
 * admin appear on the site within seconds. Outside a Next.js request (for
 * example the seed script) there is nothing to refresh, so errors are ignored.
 */
export const revalidatePaths = async (paths: string[], req?: PayloadRequest) => {
  if (req?.context?.disableRevalidate) return
  try {
    const { revalidatePath } = await import('next/cache')
    for (const path of new Set(paths)) {
      // 'layout:/' refreshes every page (used for site-wide settings).
      if (path === 'layout:/') revalidatePath('/', 'layout')
      else revalidatePath(path)
    }
  } catch {
    // Not running inside Next.js; nothing to revalidate.
  }
}

export const revalidateGlobal =
  (paths: string[] = ['/']): GlobalAfterChangeHook =>
  async ({ doc, req }) => {
    await revalidatePaths(paths, req)
    return doc
  }

export const revalidateCollection =
  (getPaths: (doc: Record<string, unknown>) => string[]): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, req }) => {
    const paths = [...getPaths(doc)]
    if (previousDoc) paths.push(...getPaths(previousDoc))
    await revalidatePaths(paths, req)
    return doc
  }

export const revalidateOnDelete =
  (getPaths: (doc: Record<string, unknown>) => string[]): CollectionAfterDeleteHook =>
  async ({ doc, req }) => {
    await revalidatePaths(getPaths(doc), req)
    return doc
  }
