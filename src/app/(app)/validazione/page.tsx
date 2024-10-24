"use client";

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode'; // Import the Html5Qrcode class

interface Biglietto {
  id: string;
  titolo: string;
  prezzo: number;
}

interface Carrello {
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
  carrello: Carrello[];
}

const Validazione: React.FC = () => {
  const [id, setId] = useState('');
  const [prenotazione, setPrenotazione] = useState<Prenotazione | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrData, setQrData] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);

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
      setQrData(data.id);
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

  // Function to handle QR code scanning result
  const handleScan = (result: string) => {
    setId(result);
    handleSearch();
  };

  // Start or stop the camera for scanning
  const toggleCamera = () => {
    if (cameraOn) {
      // Stop scanning
      html5QrcodeRef.current?.stop().then(() => {
        setCameraOn(false);
      }).catch(err => {
        console.error("Failed to stop scanning: ", err);
      });
    } else {
      // Start scanning
      const html5QrCode = new Html5Qrcode("qr-reader"); // Provide a unique ID for the QR reader element
      html5QrCode.start(
        { facingMode: "environment" }, // Use the rear camera
        {
          fps: 10, // Set frames per second
          qrbox: { width: 250, height: 250 } // Adjust the size of the scanning box
        },
        handleScan,
        (errorMessage) => {
          console.error(`QR error: ${errorMessage}`);
        }
      ).then(() => {
        setCameraOn(true);
      }).catch(err => {
        console.error("Error starting scanning: ", err);
        setError('Unable to start the QR code scanner.');
      });
    }
  };

  // Effect to clean up when component unmounts
  useEffect(() => {
    return () => {
      html5QrcodeRef.current?.stop();
    };
  }, []);

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
        className='bg-black text-white flex p-2 gap-2 items-center justify-center uppercase text-sm rounded-full'>
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

          {qrData && (
            <div className='mt-4'>
              <h3 className='text-lg font-bold'>Codice QR per la Prenotazione</h3>
              <QRCodeSVG value={qrData} size={128} />
            </div>
          )}

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

      <div className="mt-4">
        <h2 className='text-lg font-bold'>Scansione Codice QR</h2>
        <div id="qr-reader" style={{ width: '100%', height: '250px' }}></div>
        <button onClick={toggleCamera} className='bg-black text-white flex p-2 gap-2 items-center justify-center uppercase text-sm rounded-full mt-2'>
          {cameraOn ? 'Ferma Scansione QR' : 'Avvia Scansione QR'}
        </button>
      </div>
    </section>
  );
};

export default Validazione;
