
import type { BeforeChangeHook } from "node_modules/payload/dist/collections/config/types";

export const calcoloTotale: BeforeChangeHook = async ({ data, req }) => {
  try {
    // Recupera il carrello con i biglietti e le quantità
    const carrello = data.carrello;

    // Variabile per accumulare il totale
    let totaleCarrello = 0;

    // Itera su ogni biglietto nel carrello
    for (const item of carrello) {
      const { biglietto } = item;
  const itemId = typeof biglietto === 'object' ? biglietto.id : biglietto;  // Estrai l'ID se biglietto è un oggetto

      // Recupera il biglietto per ottenere il prezzo
      const bigliettoDoc = await req.payload.findByID({
        collection: 'biglietti',
        id: item.biglietto,
      });

      // Verifica se il biglietto esiste e ha un prezzo valido
      if (!bigliettoDoc || bigliettoDoc.prezzo == null) {
        throw new Error(`Il biglietto con ID ${item.biglietto} non esiste o non ha un prezzo valido.`);
      }

      // Calcola il totale per questo biglietto
      const prezzoBiglietto = bigliettoDoc.prezzo;
      const quantità = item.quantità;

      // Somma il prezzo per la quantità
      totaleCarrello += prezzoBiglietto * quantità;
    }

    // Applica lo sconto (se presente)
    if (data.sconto && data.sconto > 0) {
      totaleCarrello = totaleCarrello * (1 - data.sconto / 100);
    }

    // Aggiorna il totale nel documento
    data.totaleCarrello = totaleCarrello;
  } catch (error) {
    console.error('Errore nel calcolo del totale:', error);
    throw new Error('Errore nel calcolo del totale del carrello.');
  }
}