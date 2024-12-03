import type { BeforeChangeHook } from 'node_modules/payload/dist/collections/config/types'

export const calcoloTotale: BeforeChangeHook = async ({ data, req }) => {
  try {
    const carrello = data.carrello;
    let totaleCarrello = 0;
    let quantitaIntero = 0;
    let quantitaAtelier = 0;

    // Prepara un array di promesse per ottenere i biglietti
    const bigliettiPromesse = carrello.map(async (item) => {
      const itemId = typeof item.biglietto === 'object' ? item.biglietto.id : item.biglietto; // Ottieni l'ID del biglietto

      const bigliettoDoc = await req.payload.findByID({
        collection: 'biglietti',
        id: itemId,
      });

      if (!bigliettoDoc || bigliettoDoc.prezzo == null) {
        throw new Error(`Il biglietto con ID ${itemId} non esiste o non ha un prezzo valido.`);
      }

      return { bigliettoDoc, quantità: item.quantità };
    });

    // Esegui tutte le promesse per ottenere i dati dei biglietti
    const biglietti = await Promise.all(bigliettiPromesse);

    // Calcola il totale e le quantità di "Intero" e "Atelier"
    biglietti.forEach(({ bigliettoDoc, quantità }) => {
      const prezzoBiglietto = bigliettoDoc.prezzo;
      totaleCarrello += prezzoBiglietto * quantità;

      // Incrementa le quantità di "Intero" e "Atelier"
      if (bigliettoDoc.titolo === 'Intero') quantitaIntero += quantità;
      if (bigliettoDoc.titolo === 'Atelier') quantitaAtelier += quantità;
    });

    // Calcola lo sconto progressivo
    const numeroCoppie = Math.min(quantitaIntero, quantitaAtelier);
    const scontoTotale = numeroCoppie * 2; // Sconto di 2 per ogni coppia

    // Applica lo sconto al totale
    totaleCarrello -= scontoTotale;

    // Salva lo sconto e il totale calcolato nel documento
    data.sconto = scontoTotale;
    data.totaleCarrello = totaleCarrello;

  } catch (error) {
    console.error('Errore nel calcolo del totale:', error);
    throw new Error('Errore nel calcolo del totale del carrello.');
  }
};
