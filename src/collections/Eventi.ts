
import type { CollectionConfig } from 'payload'
export const Eventi: CollectionConfig = {

        slug: 'eventi',
        fields: [
          {
            name: 'data',
            type: 'date',
            required: true,
          },
          {
            name: 'fasceOrarie',
            type: 'array',
            required: true,
            fields: [
              {
                name: 'fasciaOraria',
                type: 'select',
                options: [
                  {
                    label: 'Mattina',
                    value: 'mattina',
                  },
                  {
                    label: 'Pomeriggio',
                    value: 'pomeriggio',
                  },
                  {
                    label: 'Sera',
                    value: 'sera',
                  },
                ],
                required: true,
              },
              {
                name: 'bigliettiDisponibili',
                type: 'number',
                defaultValue: 25,
                required: true,
              },
              {
                name: 'bigliettiPrenotati',
                type: 'number',
                defaultValue: 0,
                required: true,
              },
            ],
          },
        ],
      }
      
      
      
  