import { CollectionConfig } from 'payload';

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
    {
      name: 'fasceOrarie',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'giorno',
          type: 'select',
          options: [
            { label: 'Lunedì', value: 'monday' },
            { label: 'Martedì', value: 'tuesday' },
            { label: 'Mercoledì', value: 'wednesday' },
            { label: 'Giovedì', value: 'thursday' },
            { label: 'Venerdì', value: 'friday' },
            { label: 'Sabato', value: 'saturday' },
            { label: 'Domenica', value: 'sunday' },
          ],
          required: true,
        },
        {
          name: 'fasce',
          type: 'array',
          required: true,
          fields: [
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
          ],
        },
      ],
    },
  ],
};
