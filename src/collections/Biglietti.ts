// Eventi.ts
import type { CollectionConfig } from 'payload';

export const Biglietti: CollectionConfig = {
  slug: 'biglietti',
  access: {
    read: () => true,
    create: () => true,
  },
  admin: {
    useAsTitle: "titolo",
    defaultColumns: ['titolo', 'descrizione', 'fasceOrarie'],
   
  },
  labels: {
    singular: 'Biglietto',
    plural: 'Biglietti',
  },
  fields: [
    {
      name: "titolo",
      type: "text",
      required: true
    },
    {
      name: "prezzo",
      type: "number",
    },
    {
      name: "descrizione",
      type: "textarea"
    },
  ]
};