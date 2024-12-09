import { Prenotazioni } from "@/payload-types";
import type { AfterChangeHook } from "node_modules/payload/dist/collections/config/types";

export const generateDisponibilita: AfterChangeHook<Prenotazioni> = async ({ operation, doc, previousDoc, req }) => {
    try {
      if ( operation === 'update'  && doc.stato === 'completato' && previousDoc.stato === 'attesa_pagamento') {
        // Itera attraverso ogni elemento del carrello della prenotazione
        for (const item of doc.carrello) {
       
          const fasciaOrariaSelezionata = item.fasciaOrariaSelezionata;
          const requestedQuantity = item.quantità;

          const { biglietto } = item
          const itemId = typeof biglietto === 'object' ? biglietto.id : biglietto

          // Recupera il tipo di biglietto dal database utilizzando solo l'ID
          const tipoBiglietto = await req.payload.findByID({
            collection: 'biglietti',
            id: itemId,
          });

          if (!tipoBiglietto) {
            return; // Esci se il biglietto non è trovato
          }

          const tipoBigliettoSelezionato = tipoBiglietto.tipoBiglietto;

          // Normalizza la data per il confronto
          const normalizedDate = new Date(doc.dataPrenotazione);
          normalizedDate.setUTCHours(0, 0, 0, 0); // Porta la data a mezzanotte UTC
          const isoDateOnly = normalizedDate.toISOString().split('T')[0]; // Estrai solo giorno/mese/anno

          // Verifica la disponibilità della fascia oraria per la data e tipo biglietto
          const existingDisponibilita = await req.payload.find({
            collection: 'disponibilita',
            where: {
              tipoBiglietto: { equals: tipoBigliettoSelezionato },
              fasciaOraria: { equals: fasciaOrariaSelezionata },
              data: { equals: isoDateOnly }, // Solo la parte della data (giorno)
            },
          });

          // Se la disponibilità esiste, aggiorna
          if (existingDisponibilita.docs.length > 0) {
            const availableSlot = existingDisponibilita.docs[0];
            const newDisponibilita = availableSlot.disponibilità - requestedQuantity;

            // Verifica che la disponibilità non scenda sotto 0
            if (newDisponibilita < 0) {
              const errorMessage = `Non ci sono abbastanza posti disponibili per il biglietto ${itemId} nella fascia oraria ${fasciaOrariaSelezionata} il ${isoDateOnly}.`;
              throw new Error(errorMessage); // Lancia un errore che impedirà il completamento dell'operazione
            }

            await req.payload.update({
              collection: 'disponibilita',
              id: availableSlot.id,
              data: { disponibilità: newDisponibilita },
            });
          } else {
            // Se non ci sono disponibilità, crea una nuova voce
            let disponibilitaIniziale;

            // Assegna la disponibilità iniziale in base al tipo di biglietto
            if (tipoBigliettoSelezionato === 'visita_guidata') {
              disponibilitaIniziale = 25 - requestedQuantity; // 25 - (biglietti selezionati)
            } else if (tipoBigliettoSelezionato === 'atelier') {
              disponibilitaIniziale = 18 - requestedQuantity; // 18 - (biglietti selezionati)
            } else {
              const errorMessage = `Tipo di biglietto non supportato: ${tipoBigliettoSelezionato}`;
              throw new Error(errorMessage); // Lancia un errore se il tipo di biglietto non è valido
            }

            // Verifica se la disponibilità iniziale è negativa
            if (disponibilitaIniziale < 0) {
              const errorMessage = `Non ci sono abbastanza posti disponibili per il biglietto ${itemId} nella fascia oraria ${fasciaOrariaSelezionata} il ${isoDateOnly}.`;
              throw new Error(errorMessage); // Lancia un errore se la disponibilità è negativa
            }

            await req.payload.create({
              collection: 'disponibilita',
              data: {
                tipoBiglietto: tipoBigliettoSelezionato,
                fasciaOraria: fasciaOrariaSelezionata,
                data: normalizedDate.toISOString(), // Usa la data completa (non solo giorno)
                disponibilità: disponibilitaIniziale, // Imposta la disponibilità iniziale calcolata
              },
            });
          }
        }
      }
    } catch (error) {
      console.error('Errore durante l\'elaborazione della prenotazione:', error.message);
      throw new Error(error.message); // Lancia l'errore che impedirà la creazione o aggiornamento
    }
  }