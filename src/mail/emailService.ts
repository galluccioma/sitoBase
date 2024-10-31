import { PayloadRequest } from 'payload';

const defaultMail = 'info@musesaccademia.it';
import QRCode from 'qrcode'; // Importazione corretta della libreria QRCode


// Funzione per inviare una mail generica
const sendEmail = async ({
  to,
  subject,
  html,
  req,
  attachments,
}: {
  to: string | string[],
  subject: string,
  html: string,
  req: PayloadRequest,
  attachments?: { filename: string, content: Buffer, cid: string }[],
}) => {
  try {
    await req.payload.sendEmail({
      to,
      from: defaultMail,
      replyTo: defaultMail,
      subject,
      html,
      attachments,
    });
  } catch (error) {
    console.error("Errore durante l'invio della mail:", error);
  }
};


// Funzione per generare un QR code come immagine base64
const generateQRCode = async (data: string): Promise<Buffer> => {
  try {
    const qrCodeBuffer = await QRCode.toBuffer(data, {
      width: 180,
      margin: 1,
      color: {
        dark: '#000000', // Colore del QR code
        light: '#ffffff', // Colore dello sfondo
      },
    });
    return qrCodeBuffer;
  } catch (error) {
    console.error('Errore nella generazione del QR Code:', error);
    throw error;
  }
};

// Funzione per inviare una email di riepilogo
export const sendSummaryEmail = async ({ doc, req, state }: { doc: any, req: PayloadRequest, state: string }) => {
  const subject = `Riepilogo Prenotazione | MÚSES - Accademia Essenze`;
  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px; gap: 16px">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h1 style="color: #333; text-align: center;">📅 Dettagli della tua prenotazione:</h1>
      <ul style="list-style-type: none; padding: 0;">
        <li style="margin: 10px 0;"><strong>Utente:</strong> ${doc.utente}</li>
        <li style="margin: 10px 0;"><strong>Email:</strong> ${doc.email}</li>
        <li style="margin: 10px 0;"><strong>Data Prenotazione:</strong> ${new Date(doc.dataPrenotazione).toLocaleDateString('it-IT')}</li>
        <li style="margin: 10px 0;"><strong>Fascia Oraria:</strong> ${doc.fasciaOraria}</li>
        <li style="margin: 10px 0;"><strong>Numero di Telefono:</strong> ${doc.numeroDiTelefono}</li>
        <li style="margin: 10px 0;"><strong>Cifra:</strong> ${doc.totaleCarrello} €</li>
      </ul>
   </div>
   <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-top:16px">
      <h2 style="color: #333; text-align: center;">🧾 I dati per il bonifico:</h2>
      <ul style="list-style-type: none; padding: 0;">
        <li style="margin: 10px 0;"><strong>Cifra:</strong> ${doc.totaleCarrello} €</li>
        <li style="margin: 10px 0;"><strong>Intestazione:</strong> Associazione Atelier Kadalù</li>
        <li style="margin: 10px 0;"><strong>IBAN:</strong> IT73R0617046320000001557342</li>
        <li style="margin: 10px 0;"><strong>Causale:</strong> Acquisto biglietti online MÚSES</li>
      </ul>
      <p style="color: #555; text-align: center; margin-top: 20px;">Grazie per aver scelto MÚSES!</p>
    </div>
    <footer style="padding: 20px; text-align: center; font-family: Arial, sans-serif; color: #666; border-top: 1px solid #ddd; margin-top: 20px;">
                <p style="margin: 0; font-size: 14px;">
                <strong>Múses – Accademia Europea delle Essenze</strong><br>
                <a target="_blank" href="http://www.musesaccademia.it/" style="color: #007BFF; text-decoration: none;">www.musesaccademia.it</a><br>
                Palazzo Taffini d’Acceglio<br>
                Via Sant’Andrea, 53<br>
                12038 Savigliano (CN)<br>
                Tel. <a href="tel:+390172375025" style="color: #007BFF; text-decoration: none;">(+39) 0172 375025</a>
                </p>
            </footer>
    </div>
  </div>
`;


  await sendEmail({ to: doc.email, subject, html, req });
  await sendEmail({ to: defaultMail, subject, html, req }); // Invia anche all'amministratore
};

// Funzione per inviare email di conferma con QR code come allegato CID
export const sendClientConfirmationWithQRCode = async ({ doc, req }: { doc: any, req: PayloadRequest }) => {
  const subject = 'Grazie per la tua prenotazione | MÚSES - Accademia Essenze';
  
  // Genera il QR code come buffer
  const qrCodeBuffer = await generateQRCode(doc.id);
  
  // HTML dell'email con l'immagine inline referenziata dal Content-ID
  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h1 style="color: #333; text-align: center;">🎟️ Grazie per aver prenotato online i tuoi posti!</h1>
      <p style="color: #555;">Ecco il riepilogo della tua prenotazione:</p>
      <ul style="list-style-type: none; padding: 0;">
        <li style="margin: 10px 0;"><strong>Utente:</strong> ${doc.utente}</li>
        <li style="margin: 10px 0;"><strong>Email:</strong> ${doc.email}</li>
        <li style="margin: 10px 0;"><strong>Data Prenotazione:</strong> ${new Date(doc.dataPrenotazione).toLocaleDateString('it-IT')}</li>
        <li style="margin: 10px 0;"><strong>Fascia Oraria:</strong> ${doc.fasciaOraria}</li>
        <li style="margin: 10px 0;"><strong>Numero di Telefono:</strong> ${doc.numeroDiTelefono}</li>
      </ul>
      <h3 style="color: #333;">L'ID della tua prenotazione:</h3>
      <p style="color: #555; font-weight: bold;">${doc.id}</p>
      <h3 style="color: #333;">Il tuo QR Code relativo alla prenotazione:</h3>
      <img style="display: block; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px;" src="cid:unique-qrcode-id" title="${doc.id}" alt="${doc.id}" width="256" height="256" />
      <p style="color: #555; text-align: center; margin-top: 20px;">Ti aspettiamo!</p>
    </div>
    <footer style="padding: 20px; text-align: center; font-family: Arial, sans-serif; color: #666; border-top: 1px solid #ddd; margin-top: 20px;">
                <p style="margin: 0; font-size: 14px;">
                <strong>Múses – Accademia Europea delle Essenze</strong><br>
                <a target="_blank" href="http://www.musesaccademia.it/" style="color: #007BFF; text-decoration: none;">www.musesaccademia.it</a><br>
                Palazzo Taffini d’Acceglio<br>
                Via Sant’Andrea, 53<br>
                12038 Savigliano (CN)<br>
                Tel. <a href="tel:+390172375025" style="color: #007BFF; text-decoration: none;">(+39) 0172 375025</a>
                </p>
      </footer>
  </div>
`;


  // Invia l'email con il QR code come allegato
  await sendEmail({
    to: doc.email,
    subject,
    html,
    req,
    attachments: [
      {
        filename: 'qrcode.png',
        content: qrCodeBuffer,
        cid: 'unique-qrcode-id', // Referenziato nell'HTML con src="cid:unique-qrcode-id"
      },
    ],
  });
};

// Funzione per inviare email di notifica di mancato pagamento
export const sendPaymentFailureNotification = async ({ doc, req }: { doc: any, req: PayloadRequest }) => {
  const subject = 'Mancato Pagamento | MÚSES - Accademia Essenze';
  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h1 style="color: #e74c3c; text-align: center;">⚠️ Attenzione: Mancato Pagamento</h1>
      <p style="color: #555;">La tua prenotazione non è stata completata a causa di un mancato pagamento.</p>
      <h3 style="color: #333;">Dettagli della prenotazione:</h3>
      <ul style="list-style-type: none; padding: 0;">
        <li style="margin: 10px 0;"><strong>Utente:</strong> ${doc.utente}</li>
        <li style="margin: 10px 0;"><strong>Email:</strong> ${doc.email}</li>
        <li style="margin: 10px 0;"><strong>Data Prenotazione:</strong> ${new Date(doc.dataPrenotazione).toLocaleDateString('it-IT')}</li>
        <li style="margin: 10px 0;"><strong>Fascia Oraria:</strong> ${doc.fasciaOraria}</li>
      </ul>
      <p style="color: #555; text-align: center; margin-top: 20px;">Ti invitiamo a completare il pagamento per confermare la tua prenotazione.</p>
    </div>
    <footer style="padding: 20px; text-align: center; font-family: Arial, sans-serif; color: #666; border-top: 1px solid #ddd; margin-top: 20px;">
                <p style="margin: 0; font-size: 14px;">
                <strong>Múses – Accademia Europea delle Essenze</strong><br>
                <a target="_blank" href="http://www.musesaccademia.it/" style="color: #007BFF; text-decoration: none;">www.musesaccademia.it</a><br>
                Palazzo Taffini d’Acceglio<br>
                Via Sant’Andrea, 53<br>
                12038 Savigliano (CN)<br>
                Tel. <a href="tel:+390172375025" style="color: #007BFF; text-decoration: none;">(+39) 0172 375025</a>
                </p>
            </footer>
  </div>
`;


  await sendEmail({ to: doc.email, subject, html, req });
};
