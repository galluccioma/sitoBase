import type { CollectionConfig } from 'payload';

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
  access: {
    read: () => true,
    create: () => true,
  },
  admin: {
    useAsTitle: "id",
    defaultColumns: ['dataPrenotazione', 'stato', 'totaleCarrello', 'utente', 'email'],
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
        },
        {
          name: 'quantità',
          type: 'number',
          min: 1, // Quantità minima di 1 biglietto per evento
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
    },
    {
      name: 'numeroDiTelefono',
      type: 'text',
    },
    {
      name: 'stato',
      type: 'radio',
      options: [
        {
          value: 'nuovo',
          label: 'Nuovo',
        },
        {
          value: 'confermato',
          label: 'Confermato',
        },
        {
          value: 'respinto',
          label: 'Respinto',
        },
      ],
      defaultValue: 'nuovo',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: "totaleCarrello",
      type: "number",
      admin: {
        position: 'sidebar',
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
      async ({ operation, doc, req }) => {
        // Hook per l'invio della mail alla creazione della prenotazione
        if (operation === 'create') {
          try {
            // Recupera tutti gli utenti admin
            const adminUsers = await req.payload.find({
              collection: 'users',
              where: {
                role: {
                  equals: 'admin',
                },
              },
            });

            // Estrai gli indirizzi email degli admin
            const adminEmails = adminUsers.docs.map(user => user.email).filter(email => email);

            // Invia email a tutti gli admin
            await req.payload.sendEmail({
              to: adminEmails,
              from: defaultMail,
              replyTo: defaultMail,
              subject: 'Hai ricevuto una nuova prenotazione',
              html: `<h1>Una nuova prenotazione è stata inviata!</h1>
                     <p>Dettagli della prenotazione:</p>
                     <ul>
                       <li>Utente: ${doc.utente}</li>
                       <li>Email: ${doc.email}</li>
                       <li>Data Prenotazione: ${doc.dataPrenotazione}</li>
                       <li>Fascia Oraria: ${doc.fasciaOraria}</li>
                       <li>Numero di Telefono: ${doc.numeroDiTelefono}</li>
                     </ul>
                     <p>Ricordati di confermare o annullare la prenotazione una volta ricevuto il pagamento</p>`,
            });

            // Crea una stringa per la causale del bonifico
            const causale = doc.carrello.map((item: ItemType) => {  // Explicitly typed item
              return `${item.biglietto.title} (Quantità: ${item.quantità})`; // Usa il titolo del biglietto
            }).join(", "); // Unisce le informazioni in una stringa

            // Invio mail con info pagamento
            await req.payload.sendEmail({
              to: [doc.email],
              from: defaultMail,
              replyTo: defaultMail,
              subject: 'Grazie per la tua prenotazione',
              html: `<h1>Grazie per aver prenotato online i tuoi posti</h1>
                     <p>Riepilogo della prenotazione:</p>
                     <ul>
                       <li>Utente: ${doc.utente}</li>
                       <li>Email: ${doc.email}</li>
                       <li>Data Prenotazione: ${doc.dataPrenotazione}</li>
                       <li>Fascia Oraria: ${doc.fasciaOraria}</li>
                       <li>Numero di Telefono: ${doc.numeroDiTelefono}</li>
                     </ul>
                     <p>In allegato i dati per il bonifico:</p>
                     <p>I dati per il bonifico:
                     <ul>
                     <li>Cifra: ${doc.totaleCarrello} €</li>
                     <li>Intestazione: Associazione Atelier Kadalù</li>
                     <li>IBAN: IT73R0617046320000001557342</li>
                     <li>Causale: Aquisto Ticket Mùses</li>
                     </ul>
                     </p>`,
            });
          } catch (error) {
            console.error('Error sending email:', error);
          }
        }

        // Hook per l'invio della mail di CONFERMA
        if (operation === 'update') {
          const previousState = doc.previous ? doc.previous.stato : null;
          const currentState = doc.stato;

          // Controlla se lo stato è passato a "confermato"
          if (previousState !== 'confermato' && currentState === 'confermato') {
            try {
              // Recupera tutti gli utenti admin
              const adminUsers = await req.payload.find({
                collection: 'users',
                where: {
                  role: {
                    equals: 'admin',
                  },
                },
              });

              // Estrai gli indirizzi email degli admin
              const adminEmails = adminUsers.docs.map(user => user.email).filter(email => email);

              // Invia email a tutti gli admin
              await req.payload.sendEmail({
                to: [
                  ...adminEmails, // Spread operator to flatten the array
                  doc.email,
                ],
                from: defaultMail,
                replyTo: defaultMail,
                subject: 'Prenotazione Confermata',
                html: `<h1>Una nuova prenotazione è stata confermata!</h1>
                       <p>Dettagli della prenotazione:</p>
                       <ul>
                         <li>Utente: ${doc.utente}</li>
                         <li>Email: ${doc.email}</li>
                         <li>Data Prenotazione: ${doc.dataPrenotazione}</li>
                         <li>Fascia Oraria: ${doc.fasciaOraria}</li>
                         <li>Numero di Telefono: ${doc.numeroDiTelefono}</li>
                       </ul>
                       <p>Grazie!</p>`,
              });
            } catch (error) {
              console.error('Error sending email:', error);
            }
          }
        }
      },
    ],
  },
};
