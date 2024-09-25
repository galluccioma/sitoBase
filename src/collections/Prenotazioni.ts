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
      name: 'biglietti', // Campo array per gestire i biglietti prenotati
      type: 'array',
      required: true,
      fields: [
        {
          name: 'evento',
          type: 'relationship',
          relationTo: 'eventi',
          required: true,
        },
        {
          name: 'quantità',
          type: 'number',
          required: true,
          min: 1, // Quantità minima di 1 biglietto per evento
        },
        {
          name: 'fasciaOraria', // Nuovo campo per memorizzare la fascia oraria
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          const { biglietti, fasciaOraria } = doc;

          try {
            // Processa ogni biglietto nella prenotazione
            for (const biglietto of biglietti) {
              const { evento, quantità } = biglietto;

              // Trova l'evento associato
              const eventoDoc = await payload.findByID({
                collection: 'eventi',
                id: evento,
              });

              if (!eventoDoc || !eventoDoc.fasceOrarie) {
                throw new Error(`Evento with ID ${evento} not found or has no fasceOrarie`);
              }

              // Trova la fascia oraria corrispondente e aggiorna i biglietti disponibili
              const updatedFasceOrarie = eventoDoc.fasceOrarie.map(fascia => {
                if (fascia.fasciaOraria === fasciaOraria) {
                  return {
                    ...fascia,
                    bigliettiDisponibili: Math.max(0, fascia.bigliettiDisponibili - quantità),
                  };
                }
                return fascia;
              });

              // Aggiorna l'evento con la nuova disponibilità
              await payload.update({
                collection: 'eventi',
                id: evento,
                data: {
                  fasceOrarie: updatedFasceOrarie,
                },
              });
            }
          } catch (error) {
            console.error('Error updating ticket availability:', error);
          }
        }
      },
    ] as CollectionAfterChangeHook[],
  },
};
