import Image from 'next/image'
import styles from './styles.module.scss'

export const Logos = () => {
  return (
    <div className={styles.logos}>
      <Image
        src="/cliente.svg"
        alt="Logo Cliente"
        width={200}
        height={100}
        className={styles.payloadLogo}
        priority
      />
      <p> powered by -io</p>
     
    </div>
  )
}
