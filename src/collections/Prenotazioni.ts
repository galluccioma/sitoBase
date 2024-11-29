import { CollectionConfig } from 'payload';
import payload from 'payload';

export const Prenotazioni: CollectionConfig = {
  slug: 'prenotazioni',
  access: {
    create: () => true,
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['dataPrenotazione', 'stato', 'usato', 'totaleCarrello', 'email'],
  },
  labels: {
    singular: 'Prenotazione',
    plural: 'Prenotazioni',
  },
  fields: [
    {
      name: 'carrello',
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
          min: 1,
          required: true,
        },
        {
          name: 'fasciaOrariaSelezionata',
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
    {
      name: 'dataPrenotazione',
      type: 'date',
      required: true,
      defaultValue: new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'utente',
      type: 'text',
    },
    {
      name: 'email',
      type: 'text',
    },
    {
      name: 'stato',
      type: 'radio',
      options: [
        { value: 'attesa_pagamento', label: 'Attesa Pagamento' },
        { value: 'completato', label: 'Completato' },
      ],
      defaultValue: 'attesa_pagamento',
    },
    {
      name: 'totaleCarrello',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ operation, doc, req }) => {
        try {
          if (operation === 'create') {
            // Itera attraverso ogni elemento del carrello della prenotazione
            for (const item of doc.carrello) {
              const itemId = item.biglietto.id;
              const fasciaOrariaSelezionata = item.fasciaOrariaSelezionata;
              const requestedQuantity = item.quantità;

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
      },
      async ({ operation, doc, req }) => {
        try {
          if (operation === 'create' || operation === 'update') {
            let totaleCarrello = 0; // Inizializza la variabile per il totale del carrello
            // Itera attraverso ogni elemento del carrello della prenotazione
            for (const item of doc.carrello) {
              const itemId = item.biglietto.id;
              const requestedQuantity = item.quantità;

              // Recupera il biglietto per ottenere il prezzo
              const biglietto = await req.payload.findByID({
                collection: 'biglietti',
                id: itemId,
              });

              if (!biglietto || biglietto.prezzo == null) {
                throw new Error(`Il biglietto con ID ${itemId} non esiste o non ha un prezzo valido.`);
              }

              const prezzoBiglietto = biglietto.prezzo;

              // Somma il prezzo per la quantità
              totaleCarrello += prezzoBiglietto * requestedQuantity;
            }

            // Aggiorna il totale nel documento
            await req.payload.update({
              collection: 'prenotazioni',
              id: doc.id,
              data: {
                totaleCarrello: totaleCarrello, // Imposta il totale calcolato
              },
            });
          }
        } catch (error) {
          console.error('Errore nel calcolo del totale:', error);
          throw new Error('Errore nel calcolo del totale del carrello.');
        }
      },
    ],
  },
};