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
      name: 'evento',
      type: 'relationship',
      relationTo: 'eventi',
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        // Solo per l'operazione di creazione
        if (operation === 'create') {
          const { evento, fasciaOraria } = doc;

          try {
            // Trova l'evento associato alla prenotazione
            const eventoDoc = await payload.findByID({
              collection: 'eventi',
              id: evento,
            });

            // Assicurati che l'evento esista e che le fasceOrarie non siano null o undefined
            if (!eventoDoc || !eventoDoc.fasceOrarie) {
              throw new Error(`Evento with ID ${evento} not found or has no fasceOrarie`);
            }

            // Trova la fascia oraria selezionata
            const updatedFasceOrarie = eventoDoc.fasceOrarie.map(fascia => {
              if (fascia.fasciaOraria === fasciaOraria) {
                return {
                  ...fascia,
                  bigliettiDisponibili: Math.max(0, fascia.bigliettiDisponibili - 1),
                };
              }
              return fascia; // Mantieni invariata la fascia oraria non selezionata
            });

            // Aggiorna l'evento con il nuovo numero di biglietti disponibili
            await payload.update({
              collection: 'eventi',
              id: evento,
              data: {
                fasceOrarie: updatedFasceOrarie,
              },
            });
          } catch (error) {
            console.error('Error updating tickets:', error);
          }
        }
      },
    ] as CollectionAfterChangeHook[],
  },
};
