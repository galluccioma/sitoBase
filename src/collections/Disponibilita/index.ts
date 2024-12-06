import { CollectionConfig } from 'payload'
import { eliminazioneDisponibilita } from './hooks/eliminazioneDisponibilita';



export const Disponibilita: CollectionConfig = {
  slug: 'disponibilita',
  access: {
    read: () => true,
    create: () => true,
  },
  admin: {
    useAsTitle: 'data',
    defaultColumns: ['data', 'fasciaOraria', 'tipoBiglietto',  'disponibilità'],
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
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
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
  // hooks: {
  //   afterChange: [
  //    eliminazioneDisponibilita
  //   ]    
  // },
};
