import { CollectionConfig } from 'payload'
// import { sendClientConfirmationWithQRCode } from '../mail/emailService'

export const Prenotazioni: CollectionConfig = {
  slug: 'prenotazioni',
  access: {
    create: () => true,
  },
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
          pickerAppearance: 'dayOnly', // Solo giorno/mese/anno
          displayFormat: 'dd/MM/yyyy',
        },
      },
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
      name: 'totaleCarrello',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    // afterChange: [
    //   async ({ operation, doc, req }) => {
    //     try {
    //       if (operation === 'create' && doc.stato === 'nuovo') {
    //         for (const item of doc.carrello) {
    //           const itemId = item.biglietto;
    //           const fasciaOrariaSelezionata = item.fasciaOrariaSelezionata;
    //           const requestedQuantity = item.quantità;
    
    //           // Trova il tipoBiglietto
    //           const tipoBiglietto = await req.payload.findByID({
    //             collection: 'biglietti',
    //             id: itemId,
    //           });
    
    //           if (!tipoBiglietto) {
    //             throw new Error(`Biglietto con ID ${itemId} non trovato.`);
    //           }
    
    //           const tipoBigliettoSelezionato = tipoBiglietto.tipoBiglietto;
    
    //           // Normalizza la data
    //           const normalizedDate = new Date(doc.dataPrenotazione);
    //           normalizedDate.setUTCHours(0, 0, 0, 0);
    //           const isoDateOnly = normalizedDate.toISOString().split('T')[0];
    
    //           // Verifica la disponibilità
    //           let existingDisponibilita = await req.payload.find({
    //             collection: 'disponibilita',
    //             where: {
    //               tipoBiglietto: { equals: tipoBigliettoSelezionato },
    //               fasciaOraria: { equals: fasciaOrariaSelezionata },
    //               data: { equals: `${isoDateOnly}T00:00:00.000Z` },
    //             },
    //           });
    
    //           if (existingDisponibilita.docs.length === 0) {
    //             // Se non esistono disponibilità, creiamo una nuova voce
    //             const postiDisponibili = tipoBigliettoSelezionato === 'visita_guidata' ? 25 : 18;
    //             await req.payload.create({
    //               collection: 'disponibilita',
    //               data: {
    //                 tipoBiglietto: tipoBigliettoSelezionato,
    //                 fasciaOraria: fasciaOrariaSelezionata,
    //                 data: normalizedDate.toISOString(),
    //                 disponibilità: postiDisponibili - requestedQuantity,
    //               },
    //             });
    //           } else {
    //             // Se esiste già disponibilità, aggiorniamo la quantità
    //             const availableSlot = existingDisponibilita.docs[0];
    //             const newDisponibilita = availableSlot.disponibilità - requestedQuantity;
    //             if (newDisponibilita < 0) {
    //               throw new Error(`Non ci sono abbastanza posti disponibili per la fascia oraria ${fasciaOrariaSelezionata} il giorno ${isoDateOnly}.`);
    //             }
    //             await req.payload.update({
    //               collection: 'disponibilita',
    //               id: availableSlot.id,
    //               data: { disponibilità: newDisponibilita },
    //             });
    //           }
    //         }
    //       }
    //     } catch (error) {
    //       console.error(`Errore durante il processo di afterChange: ${error.message}`);
    //       throw error;
    //     }
    //   },
    // ],
    
  }
  
}
