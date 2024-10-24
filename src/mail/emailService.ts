import { PayloadRequest } from 'payload';

const defaultMail = 'galluccioma@gmail.com';

// Funzione per inviare una mail generica
const sendEmail = async ({
  to,
  subject,
  html,
  req,
}: {
  to: string | string[],
  subject: string,
  html: string,
  req: PayloadRequest,
}) => {
  try {
    await req.payload.sendEmail({
      to,
      from: defaultMail,
      replyTo: defaultMail,
      subject,
      html,
    });
  } catch (error) {
    console.error('Errore durante l\'invio della mail:', error);
  }
};

// Funzione per inviare una notifica all'amministratore (invio a defaultMail)
export const sendAdminNotification = async ({ doc, req }: { doc: any, req: PayloadRequest }) => {
  const subject = 'Hai ricevuto una nuova prenotazione';
  const html = `
    <h1>Una nuova prenotazione è stata inviata!</h1>
    <p>Dettagli della prenotazione:</p>
    <ul>
      <li>Utente: ${doc.utente}</li>
      <li>Email: ${doc.email}</li>
      <li>Data Prenotazione: ${doc.dataPrenotazione}</li>
      <li>Fascia Oraria: ${doc.fasciaOraria}</li>
      <li>Numero di Telefono: ${doc.numeroDiTelefono}</li>
    </ul>
    <p>Ricordati di confermare o annullare la prenotazione una volta ricevuto il pagamento</p>
  `;

  await sendEmail({ to: defaultMail, subject, html, req });
};

// Funzione per inviare una mail di conferma al cliente
export const sendClientConfirmation = async ({ doc, req }: { doc: any, req: PayloadRequest }) => {
  const subject = 'Grazie per la tua prenotazione';
  const causale = doc.carrello.map((item: any) => `${item.biglietto.title} (Quantità: ${item.quantità})`).join(", ");
  const html = `
    <h1>Grazie per aver prenotato online i tuoi posti</h1>
    <p>Riepilogo della prenotazione:</p>
    <ul>
      <li>Utente: ${doc.utente}</li>
      <li>Email: ${doc.email}</li>
      <li>Data Prenotazione: ${doc.dataPrenotazione}</li>
      <li>Fascia Oraria: ${doc.fasciaOraria}</li>
      <li>Numero di Telefono: ${doc.numeroDiTelefono}</li>
    </ul>
    <p>I dati per il bonifico:</p>
    <ul>
      <li>Cifra: ${doc.totaleCarrello} €</li>
      <li>Intestazione: Associazione Atelier Kadalù</li>
      <li>IBAN: IT73R0617046320000001557342</li>
      <li>Causale: ${causale}</li>
    </ul>
  `;

  await sendEmail({ to: doc.email, subject, html, req });
};

// Funzione per notificare il cambio di stato
export const sendStatusUpdate = async ({ doc, req }: { doc: any, req: PayloadRequest }) => {
    const subject = 'Aggiornamento dello stato della tua prenotazione';
    const html = `
      <h1>Lo stato della tua prenotazione è stato aggiornato</h1>
      <p>Il nuovo stato è: <strong>${doc.stato}</strong></p>
      <p>Grazie per aver scelto il nostro servizio!</p>
    `;
  
    await sendEmail({ to: doc.email, subject, html, req });
};