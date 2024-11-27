import { CollectionConfig } from 'payload'

export const Biglietti: CollectionConfig = {
  slug: 'biglietti',
  access: {
    read: () => true,
    create: () => true,
  },
  admin: {
    useAsTitle: 'titolo',
    defaultColumns: ['titolo', 'descrizione', 'prezzo', 'tipoBiglietto'],
  },
  labels: {
    singular: 'Biglietto',
    plural: 'Biglietti',
  },
  fields: [
    {
      name: 'titolo',
      type: 'text',
      required: true,
    },
    {
      name: 'descrizione',
      type: 'textarea',
      required: false,
    },
    {
      name: 'prezzo',
      type: 'number',
      required: true,
    },
    {
      name: 'tipoBiglietto',
      type: 'select',
      options: [
        { label: 'Visita Guidata', value: 'visita_guidata' },
        { label: 'Atelier', value: 'atelier' },
      ],
      required: true,
    },
  ],
};
