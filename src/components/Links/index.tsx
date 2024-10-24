import Link from 'next/link'
import styles from './styles.module.scss'

export const Links = () => {
  return (
    <div className={styles.links}>
      <Link href="/admin">
        <h6>Amministrazione</h6>
        <span>Gestisci i contenuti e le prenotazioni del sito dal pannello di amministrazione.</span>
        <div className={styles.scanlines} />
      </Link>
      <Link href="/cassa">
        <h6>Validazione biglietti</h6>
        <span>Valida le prenotazioni attraverso il codice o scansiona il biglietto.</span>
        <div className={styles.scanlines} />
      </Link>
      <Link href="https://musesaccademia.pages.dev">
        <h6>Vai al frontend del tuo sito</h6>
        <span>Scrivici per ottenere assistenza personalizzata.</span>
        <div className={styles.scanlines} />
      </Link>
    </div>
  )
}
