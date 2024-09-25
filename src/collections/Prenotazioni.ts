import type { CollectionConfig, CollectionAfterChangeHook } from 'payload';
import payload from 'payload';

export const Prenotazioni: CollectionConfig = {
  slug: 'prenotazioni',
  access: {
    read: () => true,
    create: () => true,
  },
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
        { label: 'Mattina', value: 'mattina' },
        { label: 'Pomeriggio', value: 'pomeriggio' },
        { label: 'Sera', value: 'sera' },
      ],
      required: true,
    },
    {
      name: 'utente',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      required: true,
    },
    {
      name: 'numeroDiTelefono',
      type: 'text',
      required: true,
    },
    {
      name: 'carrello', // Campo array per gestire i biglietti prenotati
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
          required: true,
          min: 1, // Quantità minima di 1 biglietto per evento
        },
      ],
    },
  ],
 
};
