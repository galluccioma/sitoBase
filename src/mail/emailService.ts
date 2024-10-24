import { PayloadRequest } from 'payload';
import {QRCodeSVG} from 'qrcode.react';


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
  const qrData = doc.id; // Utilizza l'ID della prenotazione per generare il codice QR

  // Genera il codice QR come SVG utilizzando QRCodeSVG
  const qrCodeSVG = `<svg>${QRCodeSVG({ value: qrData, size: 128 })}</svg>`; // Conversione in stringa SVG

  // Crea una stringa per la causale
  const causale = doc.carrello.map((item: any) => `${item.biglietto.titolo} (Quantità: ${item.quantità})`).join(", ");

  // Creazione del contenuto HTML dell'email
  const html = `
    <h1>Grazie per aver prenotato online i tuoi posti</h1>
    <h2 class='text-lg font-bold'>Dettagli Prenotazione</h2>
    <p><strong>ID:</strong> ${doc.id}</p>
    <p><strong>Stato:</strong> ${doc.stato}</p>
    <p><strong>Utente:</strong> ${doc.utente}</p>
    <p><strong>Usato:</strong> ${doc.usato ? 'Sì' : 'No'}</p>
    <p><strong>Telefono:</strong> ${doc.numeroDiTelefono}</p>
    <p><strong>Email:</strong> ${doc.email}</p>
    <p><strong>Fascia Oraria:</strong> ${doc.fasciaOraria}</p>
    
    <h3 class='text-lg font-bold'>Codice QR per la Prenotazione</h3>
    <div>${qrCodeSVG}</div> <!-- Includi il QR code nell'email -->

    <h3 class='text-lg font-bold mt-4'>Biglietti nel Carrello</h3>
    <div>
      ${doc.carrello && doc.carrello.length > 0 
        ? doc.carrello.map((item: any) => `
          <div class="border p-2 my-2">
            <p><strong>Titolo:</strong> ${item.biglietto.titolo}</p>
            <p><strong>Prezzo:</strong> €${item.biglietto.prezzo}</p>
            <p><strong>Quantità:</strong> ${item.quantità}</p>
          </div>
        `).join('') 
        : '<p>Nessun biglietto nel carrello.</p>'}
    </div>

    <h3>I dati per il bonifico:</h3>
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
