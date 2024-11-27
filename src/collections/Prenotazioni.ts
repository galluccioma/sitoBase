import { CollectionConfig } from 'payload'
import payload from 'payload';  

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
          pickerAppearance: 'dayOnly',
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
      async ({ operation, doc, req, res }) => {
        try {
          if (operation === 'create' && doc.stato === 'nuovo') {
    
            // Itera attraverso ogni elemento del carrello della prenotazione
            for (const item of doc.carrello) {
              const itemId = item.biglietto.id;  // Accedi solo all'ID del biglietto
              const fasciaOrariaSelezionata = item.fasciaOrariaSelezionata;
              const requestedQuantity = item.quantità;
    
              // Recupera il tipo di biglietto dal database utilizzando solo l'ID
              const tipoBiglietto = await req.payload.findByID({
                collection: 'biglietti',
                id: itemId, // Passa solo l'ID del biglietto
              });
    
              if (!tipoBiglietto) {
                const errorMessage = `Biglietto con ID ${itemId} non trovato.`;
                res.status(400).json({ error: errorMessage });
                return;  // Esci dall'operazione se il biglietto non è trovato
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
    
                if (newDisponibilita < 0) {
                  const errorMessage = `Non ci sono abbastanza posti disponibili per il biglietto ${itemId} nella fascia oraria ${fasciaOrariaSelezionata} il ${isoDateOnly}.`;
                  res.status(400).json({ error: errorMessage });
                  return;  // Esci dall'operazione se non ci sono abbastanza posti
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
                  disponibilitaIniziale = 25 - requestedQuantity;  // 25 - (biglietti selezionati)
                } else if (tipoBigliettoSelezionato === 'atelier') {
                  disponibilitaIniziale = 18 - requestedQuantity;  // 18 - (biglietti selezionati)
                } else {
                  // In caso di tipo di biglietto non previsto
                  const errorMessage = `Tipo di biglietto non supportato: ${tipoBigliettoSelezionato}`;
                  res.status(400).json({ error: errorMessage });
                  return;  // Esci se il tipo di biglietto non è valido
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
          // Gestione degli errori
          res.status(500).json({ error: 'Errore interno del server', message: error.message });
        }
      },
    ],    
    
  }
  
  
}
