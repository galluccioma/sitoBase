import type { CollectionConfig } from 'payload'
import { Prenotazioni } from './Prenotazioni'
import { relationship } from 'node_modules/payload/dist/fields/validations'

export const Clienti: CollectionConfig = {
  slug: 'clienti',
  admin: {
    useAsTitle: 'email',
  },
  labels: {
    singular: 'Cliente',
    plural: 'Clienti',
  },
  
  fields: [
    {
        name: 'email',
        type: 'text',
      },
      {
        name: 'prenotazioni',
        type: 'relationship',
        relationTo: 'prenotazioni',
        required: true,
        hasMany:true,
      },
  ],
}
