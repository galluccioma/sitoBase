import { CollectionConfig } from 'payload'

export const Disponibilita: CollectionConfig = {
  slug: 'disponibilita',
  access: {
    read: () => true,
    create: () => true,
  },
  admin: {
    useAsTitle: 'data',
    defaultColumns: ['data', 'tipoBiglietto', 'fasciaOraria', 'disponibilità'],
  },
  labels: {
    singular: 'Disponibilità',
    plural: 'Disponibilità',
  },
  fields: [
    {
      name: 'tipoBiglietto',
      type: 'select',
      options: [
        { label: 'Visita Guidata', value: 'visita_guidata' },
        { label: 'Atelier', value: 'atelier' },
      ],
      required: true,
    },
    {
      name: 'fasciaOraria',
      type: 'select',
      options: [
        { label: '11:30', value: '11:30' },
        { label: '14:30', value: '14:30' },
        { label: '15:30', value: '15:30' },
        { label: '17:00', value: '17:00' },
      ],
      required: true,
    },
    {
      name: 'data',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly', // Visualizza solo giorno/mese/anno
          displayFormat: 'dd/MM/yyyy', // Formatta la data come giorno/mese/anno
        },
      },
    },
    {
      name: 'disponibilità',
      type: 'number',
      required: true,
      min: 0,
    },
  ],
}
