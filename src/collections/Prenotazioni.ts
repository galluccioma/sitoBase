import type { CollectionConfig } from 'payload';
import { sendSummaryEmail, sendClientConfirmationWithQRCode, sendPaymentFailureNotification  } from '../mail/emailService';


const defaultMail = 'galluccioma@gmail.com';

// FASCIA ORARIA AUTOMATICA
const getFasciaOrariaDefault = () => {
  const currentHour = new Date().getHours(); // Ottieni l'ora corrente
  if (currentHour < 13) {
    return 'mattina'; // Prima delle 12
  } else if (currentHour < 18) {
    return 'pomeriggio'; // Tra le 12 e le 18
  } else {
    return 'sera'; // Dopo le 18
  }
};

// Define the ItemType interface for items in the carrello
interface ItemType {
  biglietto: {
    title: string; // Assuming biglietto has a title
  };
  quantità: number; // Assuming quantità is a number
}

export const Prenotazioni: CollectionConfig = {
  slug: 'prenotazioni',
  admin: {
    useAsTitle: "id",
    defaultColumns: ['dataPrenotazione', 'stato', 'usato', 'totaleCarrello',  'utente', 'email'],
  },
  access: {
    create: () => true,
  },
  auth: true,
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
          min: 1, // Quantità minima di 1 biglietto per evento
          defaultValue:1,
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
      name: 'fasciaOraria',
      type: 'select',
      options: [
        { label: 'Mattina', value: 'mattina' },
        { label: 'Pomeriggio', value: 'pomeriggio' },
        { label: 'Sera', value: 'sera' },
      ],
      required: true,
      defaultValue: getFasciaOrariaDefault(), // Imposta il valore predefinito in base all'ora
    },
    {
      name: 'utente',
      type: 'text',
      required: true,
      defaultValue: 'Prenotazione in cassa',
    },
    {
      name: 'email',
      type: 'text',
      defaultValue: 'Prenotazione in cassa',
    },
    {
      name: 'numeroDiTelefono',
      type: 'text',
      defaultValue: 'Prenotazione in cassa',
    },
    {
      name: 'stato',
      type: 'radio',
      options: [
        { value: 'nuovo', label: 'Nuovo' },
        { value: 'attesa_pagamento', label: 'Attesa Pagamento' },
        { value: 'carrello', label: 'Carrello' },
        { value: 'respinto', label: 'Respinto' },
        { value: 'completato', label: 'Completato' },
      ],
      defaultValue: 'nuovo',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'usato',
          type: 'checkbox', 
          label: 'Biglietto usato',
          defaultValue: false,
          admin: {
            position: 'sidebar',
          },
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
    beforeChange: [
      async ({ data, req }) => {
        try {
          // Recupera il carrello con i biglietti e le quantità
          const carrello = data.carrello;
      
          // Variabile per accumulare il totale
          let totaleCarrello = 0;
      
          // Itera su ogni biglietto nel carrello
          for (const item of carrello) {
            // Recupera il biglietto per ottenere il prezzo
            const biglietto = await req.payload.findByID({
              collection: 'biglietti',
              id: item.biglietto,
            });
    
            // Verifica se il biglietto esiste e ha un prezzo valido
            if (!biglietto || biglietto.prezzo == null) {
              throw new Error(`Il biglietto con ID ${item.biglietto} non esiste o non ha un prezzo valido.`);
            }
    
            // Calcola il totale per questo biglietto
            const prezzoBiglietto = biglietto.prezzo;
            const quantità = item.quantità;
    
            // Somma il prezzo per la quantità
            totaleCarrello += prezzoBiglietto * quantità;
          }
    
          // Applica lo sconto (se presente)
          if (data.sconto && data.sconto > 0) {
            totaleCarrello = totaleCarrello * (1 - data.sconto / 100);
          }
    
          // Aggiorna il totale nel documento
          data.totaleCarrello = totaleCarrello;
        } catch (error) {
          console.error('Errore nel calcolo del totale:', error);
          throw new Error('Errore nel calcolo del totale del carrello.');
        }
      },
    ],
    
    afterChange: [
      async ({ operation, doc, previousDoc, req }) => {
        if (operation === 'create') {
          // Invio della mail per nuova prenotazione
          await sendSummaryEmail({ doc, req, state: doc.stato });
        } else if (operation === 'update') {
          if (doc.stato === 'completato') {
            // Invio della mail di conferma con QR code
            await sendClientConfirmationWithQRCode({ doc, req });
          } else if (doc.stato === 'respinto') {
            // Invio della mail di mancato pagamento
            await sendPaymentFailureNotification({ doc, req });
          } else if (doc.stato === 'attesa_pagamento') {
            // Invio della mail di riepilogo per attesa pagamento
            await sendSummaryEmail({ doc, req, state: doc.stato });
          }
        }
      },
    ],
    
  },
};