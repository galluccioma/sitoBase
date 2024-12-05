import { CollectionConfig } from 'payload';

import { defaultMail } from '@/utilities/const';

export const FormSubmission: CollectionConfig = {
  slug: 'form-submissions',
  access: {
    create: () => true,
  },
  labels: {
    singular: 'Feedback',
    plural: 'Feedbacks',
  },
  fields: [
    {
      type: 'text',
      name: 'email',
      label: 'From Email',
      admin: {

      },
    },
    {
      type: 'textarea',
      name: 'message',
      label: 'Message',
      admin: {

      },
    },
    {
      type: 'text',
      name: 'source',
      label: 'Source',
      admin: {
        position: 'sidebar',

      },
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
              subject: 'Hai ricevuto una nuova compilazione Form',
              html: `<h1>Hai ricevuto una nuova compilazione Form !</h1>
                     <p></p>
                     <ul>
                       <li>Sorgente: ${doc.source}</li>
                       <li>Mail: ${doc.email}</li>
                       <li>Messaggio: ${doc.message}</li>
                       
                     </ul>
                     <p>Ricordati di confermare la prenotazione!</p>`,
            });
          } catch (error) {
            console.error('Error sending email:', error);
          }
        }
  
      },
    ],
    
  },
};
