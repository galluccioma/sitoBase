import type { CollectionConfig} from 'payload';
const defaultMail='galluccioma@gmail.com';

//FASCIA ORARIA AUTOMATICA
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
      name: 'carrello', // Campo array per gestire i biglietti prenotati
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
      defaultValue: new Date(),
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
      defaultValue:'Prenotazione in cassa'
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
      }
    },
    {
      name: "totaleCarrello",
      type: "number",
      admin: {
        position: 'sidebar',
      }
    },
  ],
 
  hooks: {
    afterChange: [
      async ({ operation, doc, req }) => {


      // Hook per l'invio della mail alla creazione della prenotazione
        if (operation === 'create') {
          try {
            // Recupera tutti gli utenti admin
            const adminUsers = await req.payload.find({
              collection: 'users', // Assicurati che 'users' sia il nome della tua collezione utenti
              where: {
                role: {
                  equals: 'admin', // Cambia questo in base alla struttura dei tuoi ruoli
                },
              },
            });

            // Estrai gli indirizzi email degli admin
            const adminEmails = adminUsers.docs.map(user => user.email).filter(email => email);
            // Invia email a tutti gli admin
            await req.payload.sendEmail({
              to: [adminEmails,],
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
                     <p>Ricordati di confermare o annulare la prenotazione una volta ricevuto il pagamento</p>`,
            });
             // Crea una stringa per la causale del bonifico
          const causale = doc.carrello.map(item => {
            return `${item.biglietto.title} (Quantità: ${item.quantità})`; // Usa il titolo del biglietto
          }).join(", "); // Unisce le informazioni in una stringa
          
           ///Invio mail con info pagamento
            await req.payload.sendEmail({
              to: [
                doc.email,
              ],
              
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
                     <p> in allegato i dati per il bonifico:

                      I dati per il bonifico:
                      acquisto ticket Muses 
                       <ul>
                     <li> cifra: ${doc.totaleCarrello} €</li>
                     <li> Intestazione: Associazione Atelier Kadalù</li>
                    <li>  IBAN: IT73R0617046320000001557342</li>
                    <li>  Causale:Aquisto Ticket Mùses</li>
                    </ul>
                    </p>`,
            });
          } catch (error) {
            console.error('Error sending email:', error);
          }; 
        };

      // Hook per l'invio della mail di CONFERMA

        if (operation === 'update') {
          const previousState = doc.previous ? doc.previous.stato : null;
          const currentState = doc.stato;

          // Controlla se lo stato è passato a "confermato"
          if (previousState !== 'confermato' && currentState === 'confermato') {
            try {
              // Recupera tutti gli utenti admin
              const adminUsers = await req.payload.find({
                collection: 'users', // Assicurati che 'users' sia il nome della tua collezione utenti
                where: {
                  role: {
                    equals: 'admin', // Cambia questo in base alla struttura dei tuoi ruoli
                  },
                },
              });

              // Estrai gli indirizzi email degli admin
              const adminEmails = adminUsers.docs.map(user => user.email).filter(email => email);

              // Invia email a tutti gli admin
              await req.payload.sendEmail({
                to: [
                  adminEmails,
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
