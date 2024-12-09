import type { AfterChangeHook } from 'node_modules/payload/dist/collections/config/types';
import { FormSubmission } from '@/payload-types';
import { defaultMail } from '@/utilities/const';

export const recapMail: AfterChangeHook<FormSubmission> = async ({ operation, doc, req }) => {
  // Verifica che l'operazione sia una creazione
  if (operation === 'create') {
    try {
      // Recupera tutti gli utenti con ruolo admi

      // Contenuto della mail
      const subject = 'Hai ricevuto una nuova compilazione Form';
      const html = `
        <h1>Hai ricevuto una nuova compilazione del Form!</h1>
        <p>Di seguito i dettagli:</p>
        <ul>
          <li><strong>Sorgente:</strong> ${doc.source || 'Non specificata'}</li>
          <li><strong>Email:</strong> ${doc.email || 'Non specificata'}</li>
          <li><strong>Messaggio:</strong> ${doc.message || 'Nessun messaggio fornito'}</li>
        </ul>
        <p>Ricordati di verificare e confermare la prenotazione!</p>
      `;

      // Invia l'email a tutti gli admin
      await req.payload.sendEmail({
        to: defaultMail,
        from: defaultMail,
        replyTo: defaultMail,
        subject,
        html,
      });

      console.log('Email di riepilogo inviata con successo agli admin.');
    } catch (error) {
      console.error('Errore durante l\'invio della mail di riepilogo:', error.message);
    }
  }
};
