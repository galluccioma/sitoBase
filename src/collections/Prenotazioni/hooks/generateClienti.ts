import { Prenotazioni } from "@/payload-types";
import type { AfterChangeHook } from "node_modules/payload/dist/collections/config/types";

export const generateClienti: AfterChangeHook<Prenotazioni> = async ({ operation, doc, previousDoc, req }) => {
  try {
    if ( operation === 'update'  && doc.stato === 'completato' && previousDoc.stato === 'attesa_pagamento') {
      const clienteEmail = doc.email; // Assumendo che l'email del cliente sia nel documento della prenotazione
      const prenotazioneId = doc.id;

      if (!clienteEmail) {
        throw new Error("L'email del cliente non è presente nel documento della prenotazione.");
      }

      // Cerca se esiste già un cliente con la stessa email
      const existingCliente = await req.payload.find({
        collection: 'clienti',
        where: {
          email: { equals: clienteEmail },
        },
      });

      if (existingCliente.docs.length > 0) {
        // Cliente esistente, aggiorna le sue prenotazioni e la spesa
        const cliente = existingCliente.docs[0];
        const existingPrenotazioni = cliente.prenotazioni || [];

        // Verifica se l'ID della prenotazione è già presente
        if (!existingPrenotazioni.includes(prenotazioneId)) {
          existingPrenotazioni.push(prenotazioneId);

          await req.payload.update({
            collection: 'clienti',
            id: cliente.id,
            data: { 
              prenotazioni: existingPrenotazioni,
            },
          });
        }
      } else {
        // Cliente non esistente, crealo con l'email, la prenotazione e la spesa iniziale
        await req.payload.create({
          collection: 'clienti',
          data: {
            email: clienteEmail,
            prenotazioni: [prenotazioneId],
          },
        });
      }
    }
  } catch (error) {
    console.error("Errore durante la gestione della collection Clienti:", error.message);
    throw new Error(error.message); // Impedisce il completamento dell'operazione in caso di errore
  }
};
