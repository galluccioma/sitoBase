import { CollectionConfig } from 'payload';

export const Disponibilita: CollectionConfig = {
  slug: 'disponibilita',
  access: {
    read: () => true,
    create: () => true,
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['tipoBiglietto', 'fasciaOraria', 'data', 'disponibilità'],
  },
  labels: {
    singular: 'Slot di disponibilità',
    plural: 'Slot di disponibilità',
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
        { label: '10:00', value: '10:00' },
        { label: '14:00', value: '14:00' },
        { label: '15:00', value: '15:00' },
      ],
      required: true,
    },
    {
      name: 'data',
      type: 'date',
      required: true,
    },
    {
      name: 'disponibilità',
      type: 'number',
      required: true,
      min: 0,
    },
  ],
};
