import { CollectionConfig } from 'payload'
import { sendClientConfirmationWithQRCode } from '../mail/emailService'

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
    afterChange: [
      async ({ operation, doc, req }) => {
        if (operation === 'create' && doc.stato === 'nuovo') {
          for (const item of doc.carrello) {
            const itemId = item.biglietto;
            const fasciaOrariaSelezionata = item.fasciaOrariaSelezionata;
            const requestedQuantity = item.quantità;
  
            const tipoBiglietto = await req.payload.findByID({
              collection: 'biglietti',
              id: itemId,
            });
  
            if (!tipoBiglietto) {
              throw new Error(`Biglietto con ID ${itemId} non trovato.`);
            }
  
            const tipoBigliettoSelezionato = tipoBiglietto.tipoBiglietto;
  
            // Verifica se la fascia oraria selezionata è valida per il giorno scelto
            const selectedDay = new Date(doc.dataPrenotazione).toLocaleDateString('en-GB', { weekday: 'long' }).toLowerCase(); // Ottieni il giorno in formato stringa (es. "monday", "tuesday")
            
            const availableFasceOrarie = tipoBiglietto.fasceOrarie.find(fascia => fascia.giorno === selectedDay);
  
            if (!availableFasceOrarie) {
              throw new Error(`La fascia oraria selezionata non è disponibile per il giorno ${selectedDay}.`);
            }
  
            const availableTimeSlot = availableFasceOrarie.fasce.some(fascia => fascia.fasciaOraria === fasciaOrariaSelezionata);
  
            if (!availableTimeSlot) {
              throw new Error(`La fascia oraria ${fasciaOrariaSelezionata} non è disponibile per il giorno ${selectedDay}.`);
            }
  
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
                data: { 
                  equals: `${isoDateOnly}T00:00:00.000Z`
                }
              },
            });
  
            if (existingDisponibilita.docs.length === 0) {
              // Se non esistono disponibilità, crea una nuova voce
              const postiDisponibili = tipoBigliettoSelezionato === 'visita_guidata' ? 25 : 18; // Puoi modificare il numero di posti a seconda del tipo di biglietto
  
              // Crea una nuova voce in disponibilità
              await req.payload.create({
                collection: 'disponibilita',
                data: {
                  tipoBiglietto: tipoBigliettoSelezionato,
                  fasciaOraria: fasciaOrariaSelezionata,
                  data: normalizedDate.toISOString(),
                  disponibilità: postiDisponibili - requestedQuantity, // Aggiorna la disponibilità
                },
              });
            } else {
              const availableSlot = existingDisponibilita.docs[0];
              const newDisponibilita = availableSlot.disponibilità - requestedQuantity;
  
              if (newDisponibilita < 0) {
                throw new Error(
                  `Non ci sono abbastanza posti disponibili per la fascia oraria ${fasciaOrariaSelezionata} il giorno ${isoDateOnly}.`
                );
              }
  
              // Aggiorna la disponibilità esistente
              await req.payload.update({
                collection: 'disponibilita',
                id: availableSlot.id,
                data: { disponibilità: newDisponibilita },
              });
            }
          }
        }
      },
    ]
  }
  
}
