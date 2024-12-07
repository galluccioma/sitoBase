import { Disponibilita } from "@/payload-types";
import type { AfterChangeHook } from "node_modules/payload/dist/collections/config/types";
import { Where } from "payload";



export const eliminazioneDisponibilita: AfterChangeHook<Disponibilita> = async ({ operation, doc, req }) => {
    console.log('Operazione:', operation);

    if (operation === 'create' || operation === 'update') {
      // Calcoliamo la data di Un giorno fa in millisecondi
      const today = new Date();
      const twoDaysAgo = today.setDate(today.getDate() - 3); // Un giorno fa

      console.log('Data Un giorno fa:', new Date(twoDaysAgo));

      try {
        // Recupera tutti i documenti dalla collezione 'disponibilita'
        const allDocuments = await req.payload.find({
          collection: 'disponibilita',
          where: {
            data: {
              lte: today.toISOString(),
            },
          } as Where,
        });

        // Confronta ogni documento con la data di Un giorno fa
        for (const document of allDocuments.docs) {
          const documentDate = new Date(document.data).getTime(); // Data del documento in millisecondi

          // Se la data del documento è più vecchia di 2 giorni, eliminarlo
          if (documentDate <= twoDaysAgo) {
            console.log(`Documento con ID ${document.id} ha una data di ${documentDate}. Verrà eliminato perché è più vecchio di 2 giorni.`);

            // Elimina il documento
            await req.payload.delete({
              collection: 'disponibilita',
              id: document.id,
            });
            console.log(`Documento con ID ${document.id} eliminato.`);
          } else {
            console.log(`Documento con ID ${document.id} non soddisfa il criterio di eliminazione.`);
          }
        }
      } catch (err) {
        console.error('Errore nel recupero o nella cancellazione dei documenti:', err);
      }
    }
  }