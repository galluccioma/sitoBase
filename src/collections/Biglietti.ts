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
    defaultColumns: ['titolo', 'descrizione', 'fasceOrarie', 'giorniAttivi'],
   
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
    {
      name: "fasceOrarie",
      type: "array",
      fields: [
        {
          name: "fasciaOraria",
          type: "select",
          options: ["mattina", "pomeriggio", "sera"],
          required: true
        },
        {
          name: "bigliettiDisponibili",
          type: "number",
          required: true,
          min: 0,
          max: 100
        }
      ]
    },
    {
      name: "giorniAttivi",
      type: "array",
      fields: [
        {
          name: "giorno",
          type: "select",
          options: ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì"],
          required: true
        }
      ]
    }
  ]
};