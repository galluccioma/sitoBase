import type { CollectionConfig} from 'payload';
const defaultMail='galluccioma@gmail.com';

export const Prenotazioni: CollectionConfig = {
  slug: 'prenotazioni',
  access: {
    read: () => true,
    create: () => true,
  },
  admin: {
    useAsTitle: "id",
    defaultColumns: ['dataPrenotazione', 'stato', 'utente', 'email'],
   
  },
  fields: [
    {
      name: 'dataPrenotazione',
      type: 'date',
      required: true,
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
              to: [
                adminEmails,
              ],
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
                     <p>Ricordati di confermare la prenotazione!</p>`,
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
