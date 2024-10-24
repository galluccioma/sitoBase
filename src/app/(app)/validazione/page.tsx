'use client'

import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import jsQR from 'jsqr' // Importa la libreria jsQR

interface Biglietto {
  id: string
  titolo: string
  prezzo: number
}

interface Carrello {
  biglietto: Biglietto
  quantità: number
  id: string
}

interface Prenotazione {
  id: string
  stato: string
  utente: string
  usato: boolean
  numeroDiTelefono: string
  email: string
  fasciaOraria: string
  biglietti: Biglietto[]
  carrello: Carrello[]
}

const Validazione: React.FC = () => {
  const [id, setId] = useState('')
  const [prenotazione, setPrenotazione] = useState<Prenotazione | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [qrData, setQrData] = useState<string | null>(null)

  // Funzione per gestire il caricamento del file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result
      if (imageData) {
        decodeQRCode(imageData as string)
      }
    }
    reader.readAsDataURL(file)
  }

  // Funzione per decodificare il codice QR dall'immagine
  const decodeQRCode = (imageData: string) => {
    const img = new Image()
    img.src = imageData
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, img.width, img.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, canvas.width, canvas.height)
        if (code) {
          setId(code.data)
          handleSearch(code.data) // Passa il codice QR decodificato
        } else {
          setError("Nessun codice QR trovato nell'immagine.")
        }
      }
    }
  }

  const handleUpdate = async () => {
    if (!prenotazione) {
      setError('Nessuna prenotazione da aggiornare.')
      return
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
      })

      if (!response.ok) {
        throw new Error("Errore durante l'aggiornamento dello stato.")
      }

      setPrenotazione((prev) => (prev ? { ...prev, usato: true } : prev))
    } catch (err: any) {
      setError(err.message || "Errore durante l'aggiornamento dello stato.")
    }
  }

  const handleSearch = async (searchId: string) => {
    // Aggiunto un parametro per l'ID
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/prenotazioni/${searchId}`)

      if (!response.ok) {
        throw new Error('Prenotazione non trovata.')
      }

      const data = await response.json()
      setPrenotazione(data)
      setQrData(data.id)
    } catch (err: any) {
      setError(err.message || 'Prenotazione non trovata.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex flex-col items-center justify-top pt-36 bg-white text-black min-h-[100vh] w-full ">
      <div className="gap-6">
        <h1 className="text-xl font-bold">Validazione Prenotazione</h1>
        <input
          type="text"
          className="border border-black focus:border-2 p-2  w-80 "
          placeholder="Inserisci ID prenotazione"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <div className="mt-4">
          <h2 className="text-lg font-bold">Scansione Codice QR</h2>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="mt-2" />
        </div>
        <button
          onClick={() => handleSearch(id)}
          disabled={loading}
          className="bg-black text-white text-lg flex w-80 p-2 mt-4 items-center justify-center uppercase rounded-full"
        >
          {loading ? 'Cercando...' : 'Cerca'}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {prenotazione && (
        <section className="flex items-top mx-auto max-w-6xl bg-white text-black gap-6 p-6">
          {/* Colonna Dettagli Prenotazione */}
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

          {/* Colonna Biglietti nel Carrello */}
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
    </section>
  )
}

export default Validazione
