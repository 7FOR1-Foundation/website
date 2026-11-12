import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Initiatives } from './collections/Initiatives'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { Subscribers } from './collections/Subscribers'
import { Users } from './collections/Users'
import { HomePage } from './globals/HomePage'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // No serverURL: local uploads keep relative URLs (/api/media/file/...), which
  // next/image serves without extra configuration. Blob uploads use Blob URLs.
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · 7FOR1 Admin' },
  },
  collections: [Initiatives, Projects, Posts, Media, Subscribers, Users],
  globals: [HomePage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    // Uploads go to Vercel Blob when a token is present (production and
    // previews). Locally, without a token, files are stored in ./media.
    // Uploads pass through the server (no direct browser-to-Blob uploads) so
    // every photo gets the watermark and size cap before it is stored. Vercel
    // limits server uploads to about 4.5 MB per file.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      // Keep the plugin's columns in the database even when it's off (locally),
      // so migrations made on a laptop match production.
      alwaysInsertFields: true,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: false,
    }),
  ],
})
