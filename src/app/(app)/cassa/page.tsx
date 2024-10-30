'use client';
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode';
import ProtectedLayout from '@/access/adminAuth';

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
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

  const onScanSuccess = (decodedText: string) => {
    setId(decodedText);
    handleSearch(decodedText);
  };

  const onScanFailed = (errorMessage: string) => {
    console.warn(`Scansione fallita: ${errorMessage}`);
  };

  const checkCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);
    } catch (error) {
      console.error('Accesso alla camera negato:', error);
      setCameraPermission(false);
    }
  };

  const startScanner = async () => {
    if (!html5QrCode) {
      const qrCode = new Html5Qrcode('qr-reader');
      setHtml5QrCode(qrCode);

      try {
        await qrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          onScanSuccess,
          onScanFailed
        );
      } catch (error) {
        console.error('Errore durante l\'avvio dello scanner QR:', error);
        setError('Errore nell\'accesso alla fotocamera. Assicurati che il dispositivo abbia una fotocamera e che l\'accesso sia consentito.');
      }
    }
  };

  const stopScanner = async () => {
    if (html5QrCode && html5QrCode.isScanning) {
      await html5QrCode.stop();
      html5QrCode.clear();
      setHtml5QrCode(null);
    }
  };

  useEffect(() => {
    checkCameraPermission(); // Controlla il permesso della camera al caricamento del componente

    if (scanning) {
      if (cameraPermission) {
        startScanner();
      } else {
        setError('Permesso della fotocamera non concesso.');
      }
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [scanning, cameraPermission]);

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
        body: JSON.stringify({ usato: true }),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'aggiornamento dello stato.");
      }

      setPrenotazione((prev) => (prev ? { ...prev, usato: true } : prev));
    } catch (err: any) {
      setError(err.message || "Errore durante l'aggiornamento dello stato.");
    }
  };

  const handleSearch = async (searchId: string) => {
    setLoading(true);
    setError('');

    if (!searchId.trim()) {
      setError('ID prenotazione non valido.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/prenotazioni/${searchId}`);

      if (!response.ok) {
        throw new Error('Prenotazione non trovata.');
      }

      const data = await response.json();
      setPrenotazione(data);
      setQrData(data.id);
    } catch (err: any) {
      setError(err.message || 'Errore durante la ricerca.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedLayout>
      <section className="flex flex-col items-center justify-top pt-36 bg-white text-black min-h-[100vh] w-full">
        <div className="gap-6">
          <h1 className="text-xl font-bold">Validazione Prenotazione</h1>
          <input
            type="text"
            className="border border-black focus:border-2 p-2 w-80"
            placeholder="Inserisci ID prenotazione"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <button
            onClick={() => handleSearch(id)}
            disabled={loading}
            className="bg-black text-white text-lg flex w-80 p-2 mt-4 items-center justify-center uppercase rounded-full"
          >
            {loading ? 'Cercando...' : 'Cerca'}
          </button>

          {/* Button to start/stop QR scanning */}
          <button
            onClick={() => setScanning(prev => !prev)}
            className="bg-black text-white text-lg flex w-80 p-2 mt-4 items-center justify-center uppercase rounded-full"
          >
            {scanning ? 'Ferma Scansione' : 'Scansiona QR'}
          </button>

          {/* QR Reader Element */}
          <div id="qr-reader" style={{ width: "250px", height: "250px" }} />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          {prenotazione && (
            <section className="flex items-top mx-auto max-w-6xl bg-white text-black gap-6 p-6">
              {/* Reservation Details Column */}
              <div className="flex-grow">
                <h2 className="text-lg font-bold">Dettagli Prenotazione</h2>
                <p>ID: {prenotazione.id}</p>
                <p>Stato: {prenotazione.stato}</p>
                <p>Utente: {prenotazione.utente}</p>
                <p>Usato: {prenotazione.usato ? 'Sì' : 'No'}</p>
                <p>Telefono: {prenotazione.numeroDiTelefono}</p>
                <p>Email: {prenotazione.email}</p>
                <p>Fascia Oraria: {prenotazione.fasciaOraria}</p>

                {qrData && (
                  <div className="mt-4">
                    <h3 className="text-lg font-bold">QR Prenotazione</h3>
                    <QRCodeSVG value={qrData} size={128} />
                  </div>
                )}
              </div>

              {/* Tickets in Cart Column */}
              <div className="flex-grow">
                {prenotazione.carrello && prenotazione.carrello.length > 0 ? (
                  <>
                    <h3 className="text-lg font-bold">Biglietti nel Carrello</h3>
                    <div className="grid grid-cols-1 gap-6">
                      {prenotazione.carrello.map((item) => (
                        <div key={item.id} className="border p-2 my-2">
                          <p>
                            <strong>Titolo:</strong> {item.biglietto.titolo}
                          </p>
                          <p>
                            <strong>Prezzo:</strong> €{item.biglietto.prezzo}
                          </p>
                          <p>
                            <strong>Quantità:</strong> {item.quantità}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p>Nessun biglietto nel carrello.</p>
                )}

                <button
                  onClick={handleUpdate}
                  className="bg-black text-white flex p-2 gap-2 items-center justify-center uppercase text-sm rounded-full mt-4"
                >
                  Valida Prenotazione
                </button>
              </div>
            </section>
          )}
        </div>
      </section>
    </ProtectedLayout>
  );
};

export default Validazione;
