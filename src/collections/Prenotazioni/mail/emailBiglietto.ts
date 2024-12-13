import { PayloadRequest } from 'payload'
import type { AfterChangeHook } from 'node_modules/payload/dist/collections/config/types'
import { Prenotazioni, Biglietti } from '@/payload-types'

import { defaultMail } from '@/utilities/const'
import QRCode from 'qrcode' // Importazione corretta della libreria QRCode

// Funzione per inviare una mail generica
const sendEmail = async ({
  to,
  subject,
  html,
  req,
  attachments,
}: {
  to: string | string[]
  subject: string
  html: string
  req: PayloadRequest
  attachments?: { filename: string; content: Buffer; cid: string }[]
}) => {
  try {
    await req.payload.sendEmail({
      to,
      from: defaultMail,
      replyTo: defaultMail,
      subject,
      html,
      attachments,
    })
  } catch (error) {
    console.error("Errore durante l'invio della mail:", error)
  }
}

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
    })
    return qrCodeBuffer
  } catch (error) {
    console.error('Errore nella generazione del QR Code:', error)
    throw error
  }
}

// Funzione per inviare email di conferma con QR code come allegato CID
export const sendClientConfirmationWithQRCode = async ({
  doc,
  req,
}: {
  doc: any
  req: PayloadRequest
}) => {
  const subject = 'Grazie per la tua prenotazione | MÚSES - Accademia Essenze'

  // Genera il QR code come buffer
  const qrCodeBuffer = await generateQRCode(doc.id)

  // Costruisci la lista dei biglietti in HTML
  let bigliettiHtml = '';
  doc.carrello.forEach((item: any) => {
    let titolo= item.biglietto ==="67473ab73d54b8f2199647e3" ?  "Atelier" : "Visita Guidata"
    bigliettiHtml += `
      <td style="border-bottom: 1px dotted #ddd; border-top: 1px dotted #ddd; padding: 10px;">
        <p><strong>Titolo:</strong> ${titolo}</p>
        <p><strong>Fascia oraria:</strong> ${item.fasciaOrariaSelezionata}</p>
        <p><strong>Quantità:</strong> ${item.quantità}</p>
      </td>
    `;
  });

  
  // HTML dell'email con l'immagine inline referenziata dal Content-ID
  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
  <div style="max-width: 1024px; margin: auto;">
        <div style="width: 500px; margin: auto; background: #fff; border-radius: 12px;">
        
          <div style=" gap: 20px; padding: 20px 20px; text-color:#000">
            <div style=" font-size: 16px; margin-bottom: 20px; width: 300px;">
              <h1 style="margin: 0; padding:10px;"> 🎟️ Múses ticket</h1>
              <p style="text-transform: uppercase; font-weight: 100; font-size: 18px;">Palazzo Taffini d’Acceglio</p>
              <p style="text-transform: uppercase; font-weight: 100; font-size: 18px;">Via Sant’Andrea, 53</br>12038 Savigliano (CN)</p>
              <p style="text-transform: uppercase; font-weight: 700; font-size: 20px;">${doc.giorno}</p>
              <p style="text-transform: uppercase; font-weight: 700; font-size: 20px;">${new Date(doc.dataPrenotazione).toLocaleDateString('it-IT')}</p>
            </div>
          </div>

      <table style="width: 100%; margin-top: 10px; background-color: #f8f8f8; padding: 10px;">
        ${bigliettiHtml}
    </table>
  
      <table style="padding: 20px 20px;">
            <td><img style="display: block; margin: auto auto; width: 150px; height: 150px;" src="cid:unique-qrcode-id" title="${doc.id}" alt="${doc.id}" width="150" height="150" /></td>
            
            <td style="width: 200px; padding:20px;">
            <h6 style="text-transform: uppercase; font-weight: 100; font-size: 18px; ">BOOKING ID: ${doc.id}</h6>
            </td>
        </table>
  
  
        <table style=" justify-content: space-between; padding: 20px; font-weight: 700; font-size: 16px; width: 80%;">
        <td><p style="text-transform: uppercase; font-weight: 400; font-size: 18px;">Importo pagato</p></td>
        <td> <p style="text-transform: uppercase; font-weight: 400; font-size: 18px;">${doc.totaleCarrello} €</p></td>
        </table>
  </div>

  </div>

   <footer style="padding: 20px; text-align: center; font-family: Arial, sans-serif; color: #666; border-top: 1px solid #ddd;  border-bottom: 1px solid #ddd; margin-top: 20px;">
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
`

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
  })
}

export const InvioBiglietto: AfterChangeHook<Prenotazioni> = async ({
  operation,
  doc,
  previousDoc,
  req,
}) => {
  if (
    operation === 'update' &&
    doc.stato === 'completato' &&
    previousDoc.stato === 'attesa_pagamento'
  ) {
    // Invio della mail di conferma con QR code
    await sendClientConfirmationWithQRCode({ doc, req });
  }
}
