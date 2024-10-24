import { PayloadRequest } from 'payload';

const defaultMail = 'galluccioma@gmail.com';
import QRCode from 'qrcode'; // Importazione corretta della libreria QRCode


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

// Funzione per generare un QR code come immagine base64
const generateQRCode = async (data: string): Promise<string> => {
  try {
    const qrCode = await QRCode.toDataURL(data, {
      width: 180,
      margin: 1,
      color: {
        dark: '#000000',  // Colore del QR code
        light: '#ffffff',  // Colore dello sfondo
      },
    });
    return qrCode; // Ritorna l'immagine QR code in formato base64
  } catch (error) {
    console.error('Errore nella generazione del QR Code:', error);
    throw error;
  }
};

// Funzione per inviare una email di riepilogo
export const sendSummaryEmail = async ({ doc, req, state }: { doc: any, req: PayloadRequest, state: string }) => {
  const subject = `Riepilogo Prenotazione - Stato: ${state}`;
  const causale = doc.carrello.map((item: any) => `${item.biglietto.title} (Quantità: ${item.quantità})`).join(", ");
  const html = `
    <h1>Dettagli della tua prenotazione:</h1>
    <ul>
      <li>Utente: ${doc.utente}</li>
      <li>Email: ${doc.email}</li>
      <li>Data Prenotazione: ${doc.dataPrenotazione}</li>
      <li>Fascia Oraria: ${doc.fasciaOraria}</li>
      <li>Numero di Telefono: ${doc.numeroDiTelefono}</li>
      <li>Cifra: ${doc.totaleCarrello} €</li>
    </ul>
    <p>I dati per il bonifico:</p>
    <ul>
      <li>Cifra: ${doc.totaleCarrello} €</li>
      <li>Intestazione: Associazione Atelier Kadalù</li>
      <li>IBAN: IT73R0617046320000001557342</li>
      <li>Causale: ${causale}</li>
  `;

  await sendEmail({ to: doc.email, subject, html, req });
  await sendEmail({ to: defaultMail, subject, html, req }); // Invia anche all'amministratore
};

// Funzione per inviare email di conferma con QR code
export const sendClientConfirmationWithQRCode = async ({ doc, req }: { doc: any, req: PayloadRequest }) => {
  const subject = 'Grazie per la tua prenotazione';
  const qrCodeUrl = await generateQRCode(doc.id);
  
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
    <h3>Il tuo QR Code:</h3>
    <img src="${qrCodeUrl}" alt="QR Code per la tua prenotazione" />
  `;

  await sendEmail({ to: doc.email, subject, html, req });
};

// Funzione per inviare email di notifica di mancato pagamento
export const sendPaymentFailureNotification = async ({ doc, req }: { doc: any, req: PayloadRequest }) => {
  const subject = 'Notifica di Mancato Pagamento';
  const html = `
    <h1>Attenzione: Mancato Pagamento</h1>
    <p>La tua prenotazione non è stata completata a causa di un mancato pagamento.</p>
    <p>Dettagli della prenotazione:</p>
    <ul>
      <li>Utente: ${doc.utente}</li>
      <li>Email: ${doc.email}</li>
      <li>Data Prenotazione: ${doc.dataPrenotazione}</li>
      <li>Fascia Oraria: ${doc.fasciaOraria}</li>
    </ul>
    
  `;

  await sendEmail({ to: doc.email, subject, html, req });
};
