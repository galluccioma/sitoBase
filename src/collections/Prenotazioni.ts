import { CollectionConfig } from 'payload';
import { sendClientConfirmationWithQRCode } from '../mail/emailService';

export const Prenotazioni: CollectionConfig = {
  slug: 'prenotazioni',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['dataPrenotazione', 'stato', 'usato', 'totaleCarrello', 'utente', 'email'],
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
            { label: '10:00', value: '10:00' },
            { label: '14:00', value: '14:00' },
            { label: '15:00', value: '15:00' },
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
    },
    {
      name: 'utente',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      required: false,
    },
    {
      name: 'stato',
      type: 'radio',
      options: [
        { value: 'nuovo', label: 'Nuovo' },
        { value: 'attesa_pagamento', label: 'Attesa Pagamento' },
        { value: 'respinto', label: 'Respinto' },
        { value: 'completato', label: 'Completato' },
      ],
      defaultValue: 'nuovo',
    },
    {
      name: "totaleCarrello",
      type: "number",
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ operation, doc, req }) => {
        if (operation === 'create' && doc.stato === 'nuovo') {
          // Loop through each item in the cart
          for (const item of doc.carrello) {
            const itemId = item.biglietto;
            const fasciaOrariaSelezionata = item.fasciaOrariaSelezionata;
            const requestedQuantity = item.quantità;

            // Recuperiamo il tipo di biglietto selezionato
            const tipoBiglietto = await req.payload.findByID({
              collection: 'biglietti',
              id: itemId,
            });

            if (!tipoBiglietto) {
              throw new Error(`Biglietto con ID ${itemId} non trovato.`);
            }

            const tipoBigliettoSelezionato = tipoBiglietto.tipoBiglietto;

            // Verifica la disponibilità esistente per la tipologia di biglietto, fascia oraria e data specifica
            const existingDisponibilita = await req.payload.find({
              collection: 'disponibilita',
              where: {
                tipoBiglietto: { equals: tipoBigliettoSelezionato }, // Filtra per tipoBiglietto
                fasciaOraria: { equals: fasciaOrariaSelezionata },   // Filtra per fasciaOraria
                data: { equals: doc.dataPrenotazione },             // Filtra per data
              },
            });

            if (existingDisponibilita.docs.length === 0) {
              // Se non esiste un record di disponibilità, crea una nuova disponibilità
              const postiDisponibili = tipoBigliettoSelezionato === 'visita_guidata' ? 25 : 18;

              await req.payload.create({
                collection: 'disponibilita',
                data: {
                  tipoBiglietto: tipoBigliettoSelezionato,
                  fasciaOraria: fasciaOrariaSelezionata,
                  data: doc.dataPrenotazione,
                  disponibilità: postiDisponibili - requestedQuantity, // Riduci la disponibilità in base alla richiesta
                },
              });
            } else {
              // Se esiste una disponibilità, aggiorniamo il valore
              const availableSlot = existingDisponibilita.docs[0];
              const newDisponibilita = availableSlot.disponibilità - requestedQuantity;

              // Verifica se la disponibilità è sufficiente
              if (newDisponibilita < 0) {
                throw new Error(`Non ci sono abbastanza posti disponibili per la fascia oraria ${fasciaOrariaSelezionata} alla data ${doc.dataPrenotazione}.`);
              }

              // Aggiorniamo la disponibilità con il nuovo valore
              await req.payload.update({
                collection: 'disponibilita',
                id: availableSlot.id,
                data: {
                  disponibilità: newDisponibilita,
                },
              });
            }
          }
        }
      },
    ],
  },
};
