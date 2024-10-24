"use client";

import React, { useState } from 'react';



interface Biglietto {
  id: string;
  titolo: string;
  prezzo: number;
}

interface Carrello{
  biglietto: Biglietto;
  quantità: number;
  id: string;
}

interface Prenotazione {
  id: string;
  stato: string;
  utente: string;
  usato: boolean;
  numeroDiTelefono: string;
  email: string;
  fasciaOraria: string;
  biglietti: Biglietto[];
  carrello:Carrello[];
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
    if (!prenotazione) {
      setError('Nessuna prenotazione da aggiornare.');
      return;
    }

    try {
      const response = await fetch(`/api/prenotazioni/${prenotazione.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usato: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Errore durante l\'aggiornamento dello stato.');
      }

      setPrenotazione(prev => prev ? { ...prev, usato: true } : prev);
    } catch (err: any) {
      setError(err.message || 'Errore durante l\'aggiornamento dello stato.');
    }
  };

  return (
    <section className='flex flex-col items-center justify-center bg-white text-black h-[100vh] w-full gap-6'>
      <h1 className='text-xl font-bold'>Validazione Prenotazione</h1>
      <input
        type="text"
        className='border border-black p-2 focus:border-2'
        placeholder="Inserisci ID prenotazione"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}
      className='bg-black text-white flex p-2 gap-2 items-center justify-center uppercase text-sm rounded-full '>
        {loading ? 'Cercando...' : 'Cerca'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {prenotazione && (
  <div>
    <h2 className='text-lg font-bold'>Dettagli Prenotazione</h2>
    <p>ID: {prenotazione.id}</p>
    <p>Stato: {prenotazione.stato}</p>
    <p>Utente: {prenotazione.utente}</p>
    <p>Usato: {prenotazione.usato ? 'Sì' : 'No'}</p>
    <p>Telefono: {prenotazione.numeroDiTelefono}</p>
    <p>Email: {prenotazione.email}</p>
    <p>Fascia Oraria: {prenotazione.fasciaOraria}</p>

    {/* Ensure the carrello array exists before rendering */}
    {prenotazione.carrello && prenotazione.carrello.length > 0 ? (
      <>
        <h3 className='text-lg font-bold mt-4'>Biglietti nel Carrello</h3>
        <div className='grid grid-cols-4 gap-6'>
        {prenotazione.carrello.map((item) => (
          <div key={item.id} className="border p-2 my-2">
            <p><strong>Titolo:</strong> {item.biglietto.titolo}</p>
            <p><strong>Prezzo:</strong> €{item.biglietto.prezzo}</p>
            <p><strong>Quantità:</strong> {item.quantità}</p>

            
          </div>
        ))}
        </div>
      </>
    ) : (
      <p>Nessun biglietto nel carrello.</p>
    )}
    
    <button onClick={handleUpdate} className='bg-black text-white flex p-2 gap-2 items-center justify-center uppercase text-sm rounded-full mt-4'>
      Valida Biglietto
    </button>
  </div>
)}


    </section>
  );
};

export default Validazione;
