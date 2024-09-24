// Eventi.ts
import type { CollectionConfig } from 'payload';

export const Eventi: CollectionConfig = {
  slug: 'eventi',
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: "titolo",
      type: "text",
      required: true
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