const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);  // La tua chiave privata

exports.handler = async (event) => {
  try {
    const { prenotazioneId } = JSON.parse(event.body); // ID della prenotazione

    // Recupera i dettagli della prenotazione dal tuo backend (Payload CMS)
    const prenotazione = await fetch(`${process.env.BACKEND_URL}/api/prenotazioni/${prenotazioneId}`, {
      headers: {
        Authorization: `users API-Key ${process.env.API_KEY}`,
      },
    }).then((res) => res.json());

    if (!prenotazione) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Prenotazione non trovata" }),
      };
    }

    // Crea una sessione di pagamento con Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "EUR",
            product_data: {
              name: `Prenotazione #${prenotazioneId}`,
            },
            unit_amount: Math.round(prenotazione.totaleCarrello * 100), // Totale in centesimi
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/grazie`, // URL di successo
      cancel_url: `${process.env.FRONTEND_URL}/checkout?canceled=true`, // URL di annullamento
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.error("Errore durante la creazione della sessione di pagamento:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore durante la creazione della sessione di pagamento" }),
    };
  }
};
