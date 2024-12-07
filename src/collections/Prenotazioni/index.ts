import { CollectionConfig } from 'payload'
import payload from 'payload'
import { generateDisponibilita } from './hooks/generateDisponibilita'
import { calcoloTotale } from './hooks/calcoloTotale'
import { InvioBiglietto } from './mail/emailBiglietto'


export const Prenotazioni: CollectionConfig = {
  slug: 'prenotazioni',
  access: {
    create: () => true,
    update:() => true,
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['dataPrenotazione', 'giorno', 'stato', 'totaleCarrello', 'visitaUsato','atelierUsato', 'email'],
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
      label: 'Data Prenotata',
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
      name: 'giorno',
      type: 'text',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [({ data }) => {
          const date = new Date(data?.dataPrenotazione);
          const daysOfWeek = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
          data!.giorno = daysOfWeek[date.getDay()];
        }],
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
        { value: 'annullato', label: 'Annullato' },
        { value: 'completato', label: 'Completato' }
        

      ],
      defaultValue: 'attesa_pagamento',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'visitaUsato',
          type: 'checkbox', 
          label: 'Visita guidata validata',
          defaultValue: false,
          admin: {
            position: 'sidebar',
          },
    },
    {
      name: 'atelierUsato',
          type: 'checkbox', 
          label: 'Atelier validato',
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
