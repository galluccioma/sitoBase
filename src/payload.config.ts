import { buildConfig } from 'payload'

//import { postgresAdapter } from '@payloadcms/db-postgres'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
//Lingue
import { it } from 'payload/i18n/it'
import { en } from 'payload/i18n/en'


//Storage
import { s3Storage } from '@payloadcms/storage-s3'
//Mail
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

//Plugin

import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

// Import delle collezioni
import { Users } from './collections/Users' // Collezione utenti
import { Media } from './collections/Media' // Collezione media
import { Categories } from './collections/Categories' // Collezione categorie
import { Blog } from './collections/Blog'
import { FormSubmission } from './collections/Formsubmission' //Collezione Form
import { Biglietti } from './collections/Biglietti' // Collezione biglietti
import { Prenotazioni } from './collections/Prenotazioni'
import { Aggiornamenti } from './collections/Aggiornamenti'  // Collezione Mostre
import { Disponibilita } from './collections/Disponibilita'
import { Clienti } from './collections/Clienti'

//import dei globali
import {Banner} from './globals/Banner'


// Determina il percorso corrente del file
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Configurazione principale di Payload
export default buildConfig({
  admin: {
    user: Users.slug, // Collezione per la gestione degli utenti amministrativi
    meta: {
      titleSuffix: 'Umazing Backend', // Suffisso del titolo nel pannello admin
      description: 'Backend powered by umazing', // Descrizione del backend
      icons: [
        {
          type: 'Logo', // Tipo di icona
          rel: 'icon', // Relazione dell'icona (favicon)
          url: '/favicon.svg', // Percorso dell'icona
        },
      ],
    },
   components: {
      graphics: {
        Logo:'@/components/Logo',
        Icon:'@/components/Icon',
      },
      afterDashboard:['@/components/Validazione'],
    },
  },

  
  collections: [
    Prenotazioni,// Collezione per le prenotazioni
    Biglietti,    // Collezione per i biglietti
    Disponibilita, //Slot disponibilita
    Clienti,
    FormSubmission, // Collezione degli invii del modulo
    Aggiornamenti,  // Collezione mostre
    Blog,        // Collezione per il blog
    Categories,  // Collezione delle categorie
    Media,       // Collezione per i media
    Users,        // Collezione utenti
  ],
  
  globals:[
    Banner,     // Globale banner
  ],
  
  editor: lexicalEditor({}), // Configurazione per l'editor di testo Lexical
  
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // db: postgresAdapter({
  //   pool: {
  //     connectionString: process.env.POSTGRES_URI || ''
  //   }
  // }),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),

  i18n: {
    supportedLanguages: { it, en},
  },
  
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
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


  sharp, // Usato per la gestione delle immagini (sharp)

  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media', // Prefisso per i file media salvati su S3
        },
      },
      bucket: process.env.S3_BUCKET || '', // Bucket S3, caricato dalle variabili d'ambiente
      config: {
        forcePathStyle: true, // Opzione per forzare il percorso degli oggetti
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '', // Chiave di accesso S3
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '', // Chiave segreta S3
        },
        region: process.env.S3_REGION, // Regione S3
        endpoint: process.env.S3_ENDPOINT, // Endpoint S3 (es. per server compatibili con S3)
      },
    }),
  ],

  //Paypal
  
  //Mail Adapter
  email: nodemailerAdapter({
    defaultFromAddress: 'galluccioma@gmail.com',
    defaultFromName: 'Muses',
    // Nodemailer transportOptions
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  cors:[
     "http://localhost:4000", //test
    "https://musesaccademia.pages.dev", //production
    "https://www.accademiaessenze.it",
    "https://accademiaessenze.it",
  ]  
});