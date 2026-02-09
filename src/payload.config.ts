import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { CoffeeShops } from './collections/CoffeeShops'
import { Tags } from './collections/Tags'
import { Media } from './collections/Media'

import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, CoffeeShops, Tags, Media],
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      addRandomSuffix: true,
    }),
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    generateSchemaOutputFile: 'src/db/schema/payload-generated-schema.ts',
    push: false,
    allowIDOnCreate: true,
    schemaName: 'payload',
    migrationDir: 'src/db/migrations'
  }),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  cors: [getServerSideURL()].filter(Boolean),
  sharp,
  // logger: {
  //   options: {
  //     level: 'trace',
  //   }
  // }
});
