"use client";

import React, { useState } from 'react';

interface Prenotazione {
  id: string;
  stato: string;
  utente: string;
}

const Validazione: React.FC = () => {
  const [id, setId] = useState('');
  const [prenotazione, setPrenotazione] = useState<Prenotazione | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/prenotazioni/${id}`);
      
      // Verifica se la risposta è OK
      if (!response.ok) {
        throw new Error('Prenotazione non trovata.');
      }

      const data = await response.json();
      setPrenotazione(data);
    } catch (err: any) {
      setError(err.message || 'Prenotazione non trovata.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/prenotazioni/${prenotazione.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stato: 'completato', // Cambia lo stato a 'completato'
        }),
      });

      // Verifica se la risposta è OK
      if (!response.ok) {
        throw new Error('Errore durante l\'aggiornamento dello stato.');
      }

      // Aggiorna lo stato locale della prenotazione
      setPrenotazione(prev => ({ ...prev, stato: 'completato' }));
    } catch (err: any) {
      setError(err.message || 'Errore durante l\'aggiornamento dello stato.');
    }
  };

  return (
    <section className='bg-white text-black h-full w-full flex items-center justify-center'>
      <h1 className='text-red-500'>Validazione Prenotazione</h1>
      <input
        type="text"
        placeholder="Inserisci ID prenotazione"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Cercando...' : 'Cerca'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {prenotazione && (
        <div>
          <h2>Dettagli Prenotazione</h2>
          <p>ID: {prenotazione.id}</p>
          <p>Stato: {prenotazione.stato}</p>
          <p>Utente: {prenotazione.utente}</p>
          <button onClick={handleUpdate}>
            Conferma Prenotazione
          </button>
        </div>
      )}
    </section>
  );
};

export default Validazione;