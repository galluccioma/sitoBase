
import type { CollectionConfig } from 'payload'
export const Prenotazioni: CollectionConfig = {
    slug: 'prenotazioni',
    fields: [
      {
        name: 'dataPrenotazione',
        type: 'date',
        required: true,
      },
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
        name: 'utente',
        type: 'text',
        required: true,
      },
      {
        name: 'evento',
        type: 'relationship',
        relationTo: 'eventi', // Questa è la relazione corretta
        required: true,
      },
    ],
  }
  