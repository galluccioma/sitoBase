import { CollectionConfig } from 'payload'

import { generateDisponibilita } from './hooks/generateDisponibilita'
import { calcoloTotale } from './hooks/calcoloTotale'
import { InvioBiglietto } from './mail/emailBiglietto'


export const Prenotazioni: CollectionConfig = {
  slug: 'prenotazioni',
  access: {
    create: () => true,
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['dataPrenotazione', 'stato', 'usato', 'totaleCarrello', 'email'],
  },
  labels: {
    singular: 'Prenotazione',
    plural: 'Prenotazioni',
  },
  fields: [
    {
      name: 'carrello',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'biglietto',
          type: 'relationship',
          relationTo: 'biglietti',
          required: true,
        },
        {
          name: 'quantità',
          type: 'number',
          min: 1,
          required: true,
        },
        {
          name: 'fasciaOrariaSelezionata',
          type: 'select',
          options: [
            { label: '11:30', value: '11:30' },
            { label: '14:30', value: '14:30' },
            { label: '15:30', value: '15:30' },
            { label: '17:00', value: '17:00' },
          ],
          required: true,
        },
      ],
    },
    {
      name: 'dataPrenotazione',
      type: 'date',
      required: true,
      defaultValue: new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'email',
      type: 'text',
    },
    {
      name: 'stato',
      type: 'radio',
      options: [
        { value: 'attesa_pagamento', label: 'Attesa Pagamento' },
        { value: 'completato', label: 'Completato' },
        { value: 'annullato', label: 'Annullato' },
      ],
      defaultValue: 'attesa_pagamento',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'usato',
          type: 'checkbox', 
          label: 'Biglietto usato',
          defaultValue: false,
          admin: {
            position: 'sidebar',
          },
    },
    {
      name: 'totaleCarrello',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sconto',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      calcoloTotale,
    ],
    afterChange: [
      generateDisponibilita,
      InvioBiglietto,

    ],
  },
}
