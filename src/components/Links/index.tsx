import Link from 'next/link'
import styles from './styles.module.scss'

export const Links = () => {
  return (
    <div className={styles.links}>
      <Link href="/admin">
        <h6>Amministrazione</h6>
        <span>Gestisci i contenuti del sito dal pannello di amministrazione.</span>
        <div className={styles.scanlines} />
      </Link>
      <Link href="https://galluccioma.com">
        <h6>Documentazione</h6>
        <span>Scopri come modificare i contenuti dal tuo backend.</span>
        <div className={styles.scanlines} />
      </Link>
      <Link href="https://galluccioma.com">
        <h6>Next.js Docs</h6>
        <span>Find in-depth information about Next.js features and API.</span>
        <div className={styles.scanlines} />
      </Link>
      <Link href="https://galluccioma.com">
        <h6>Hai bisogno di aiuto?</h6>
        <span>Scrivici per ottenere assistenza personalizzata.</span>
        <div className={styles.scanlines} />
      </Link>
    </div>
  )
}
