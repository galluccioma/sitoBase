import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Logo } from './components/WhiteLabel'
import { Icon } from './components/WhiteLabel'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Blog } from './collections/Blog'
import { FormSubmission } from './collections/Formsubmission'
import {Eventi} from './collections/Eventi'
import { Prenotazioni } from './collections/Prenotazioni'



const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: 'Backend -io',
      description: 'Backend powered by -io',
      icons: [
        {
          type: 'Logo',
          rel: 'icon',
          url: '/favicon.svg',
          
        },
      ],
    },   
   
    components: {
      graphics: {
        Logo,
        Icon,
      },
    },
 
  },
  collections: [ Eventi , Blog, Categories, Tags, Prenotazioni, FormSubmission, Media, Users],
  localization: {
    locales: [
     
      {
        label: 'Italiano',
        code: 'it',
        // opt-in to setting default text-alignment on Input fields to rtl (right-to-left)
        // when current locale is rtl
        rtl: true,
      },
    ],
    defaultLocale: 'it',
    fallback: true,
  },
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL,
    },
  }),

  sharp,

  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        }
      },
      bucket: process.env.S3_BUCKET||  '',
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID||  '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY||  '',
        },
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
      },
    }),

  ],
})
