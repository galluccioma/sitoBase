'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Html5Qrcode } from 'html5-qrcode'

import './styles.scss'

interface Biglietto {
  id: string
  titolo: string
  prezzo: number
  fasciaOraria: string
}

interface Carrello {
  biglietto: Biglietto
  quantità: number
  id: string
  fasciaOrariaSelezionata: string
}

interface Prenotazione {
  id: string
  email: string
  stato: string
  usato: boolean
  biglietti: Biglietto[]
  carrello: Carrello[]
}

const Validazione: React.FC = () => {
  const [id, setId] = useState('')
  const [prenotazione, setPrenotazione] = useState<Prenotazione | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [qrData, setQrData] = useState<string | null>(null)
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null)
  const [scanning, setScanning] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)

  const onScanSuccess = useCallback((decodedText: string) => {
    setId(decodedText)
    setScanning(false)
    handleSearch(decodedText)
  }, [])

  const onScanFailed = useCallback((errorMessage: string) => {
    console.warn(`Scansione fallita: ${errorMessage}`)
  }, [])

  const checkCameraPermission = useCallback(async () => {
    // Verifica se il consenso è già salvato nel localStorage
    const storedPermission = localStorage.getItem('cameraPermission')

    if (storedPermission === 'granted') {
      // Permesso già concesso
      setCameraPermission(true)
      return
    } else if (storedPermission === 'denied') {
      // Permesso negato
      setCameraPermission(false)
      return
    }

    // Mostra un avviso che spiega perché hai bisogno del permesso
    const userConsent = window.confirm(
      'Questa applicazione richiede accesso alla tua fotocamera per scansionare i codici QR. Vuoi concedere il permesso?',
    )

    if (userConsent) {
      // Richiedi accesso alla fotocamera
      try {
        await navigator.mediaDevices.getUserMedia({ video: true })
        setCameraPermission(true)
        localStorage.setItem('cameraPermission', 'granted') // Salva il permesso nel localStorage
      } catch (error) {
        console.error('Accesso alla camera negato:', error)
        setCameraPermission(false)
        localStorage.setItem('cameraPermission', 'denied') // Salva il permesso nel localStorage
      }
    } else {
      setCameraPermission(false)
      localStorage.setItem('cameraPermission', 'denied') // Salva il permesso nel localStorage
    }
  }, [])

  const startScanner = useCallback(async () => {
    if (!html5QrCode) {
      const qrCode = new Html5Qrcode('qr-reader')
      setHtml5QrCode(qrCode)

      try {
        await qrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          onScanSuccess,
          onScanFailed,
        )
      } catch (error) {
        console.error("Errore durante l'avvio dello scanner QR:", error)
        setError(
          "Errore nell'accesso alla fotocamera. Assicurati che il dispositivo abbia una fotocamera e che l'accesso sia consentito.",
        )
      }
    }
  }, [html5QrCode, onScanSuccess, onScanFailed])

  const stopScanner = useCallback(async () => {
    if (html5QrCode && html5QrCode.isScanning) {
      await html5QrCode.stop()
      html5QrCode.clear()
      setHtml5QrCode(null)
    }
  }, [html5QrCode])

  useEffect(() => {
    checkCameraPermission()
  }, [checkCameraPermission])

  useEffect(() => {
    if (scanning) {
      if (cameraPermission) {
        startScanner()
      } else {
        setError('Permesso della fotocamera non concesso.')
      }
    } else {
      stopScanner()
    }

    return () => {
      stopScanner() // Assicurati di fermare lo scanner quando il componente si smonta o quando 'scanning' cambia
    }
  }, [scanning, cameraPermission, startScanner, stopScanner])

  const handleUpdate = async () => {
    if (!prenotazione) {
      setError('Nessuna prenotazione da aggiornare.')
      return
    }

      const response = await fetch(`/api/prenotazioni/${prenotazione.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usato: true }),
      })

      if (!response.ok) {
        throw new Error("Errore durante l'aggiornamento dello stato.")
      }

      setPrenotazione((prev) => (prev ? { ...prev, usato: true } : prev))
    
  }

  const handleSearch = async (searchId: string) => {
    setLoading(true)
    setError('')

    if (!searchId.trim()) {
      setError('ID prenotazione non valido.')
      setLoading(false)
      setScanning(false) // Stop scanner if the ID is invalid
      return
    }

    try {
      const response = await fetch(`/api/prenotazioni/${searchId}`)

      if (!response.ok) {
        throw new Error('Prenotazione non trovata.')
      }

      const data = await response.json()
      setPrenotazione(data)
      setQrData(data.id)
      await stopScanner() // Ensure scanner stops as soon as a valid ID is found
      setScanning(false) // Update state after stopping scanner
    } catch (err: any) {
      setError(err.message || 'Errore durante la ricerca.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex flex-col items-start justify-top bg-white text-black ">
      <div className="gap-6 w-full wt-max-w-4xl">
        <h2 className="text-3xl wt-my-6">Validazione Prenotazione</h2>
        <div className="bg-gray p-6">
          <input
            type="text"
            className="border border-black-40 focus:border-black-70 p-4 w-full "
            placeholder="Inserisci ID prenotazione"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <button
            onClick={() => handleSearch(id)}
            disabled={loading}
            className="bg-black text-white text-lg flex p-2 mt-4 items-center justify-center uppercase w-full"
          >
            {loading ? 'Cercando...' : 'Cerca'}
          </button>

          {/* Button to start/stop QR scanning */}
          <button
            onClick={() => setScanning((prev) => !prev)}
            className="bg-zinc-200 border text-black text-lg flex p-2 mt-4 items-center justify-center uppercase rounded-sm w-full"
          >
            {scanning ? 'Ferma Scansione' : 'Scansiona QR'}
          </button>
        </div>
        {prenotazione && (
          <section className="flex items-top mx-auto max-w-6xl bg-white text-black gap-6 p-6">
            {/* Reservation Details Column */}
            <div className="flex   p-6">
              {qrData && (
                <div className="mt-4 p-6">
                  <QRCodeSVG value={qrData} size={128} />
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold">Dettagli Prenotazione</h2>
                <p>ID: {prenotazione.id}</p>
                <p>Email: {prenotazione.email}</p>
                <p>Stato: {prenotazione.stato}</p>
                <p className="text-lg font-bold">
                  {' '}
                  Usato: {prenotazione.usato ? 'Sì' : 'No'}
                </p>
              </div>
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
                          <strong>Fascia oraria:</strong> {item.fasciaOrariaSelezionata}
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

              {!prenotazione.usato && (
                <button
                  onClick={handleUpdate}
                  className="bg-red text-white flex p-2 items-center justify-center uppercase text-lg w-full mt-4">
                  Valida Prenotazione {}
                </button>
              )}
            </div>
          </section>
        )}
      </div>
      {/* QR Reader Element */}
      <div id="qr-reader" className="mt-4" style={{ width: '100px', height: '100px' }} />

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </section>
  )
}

export default Validazione
