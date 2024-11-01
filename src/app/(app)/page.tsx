"use client"
import { Logos } from '@/components/Logos'
import { Links } from '@/components/Links'
import { Background } from '@/components/Background'
import useServiceWorker from '../hooks/useServiceWorker'


export default function Home() {
  useServiceWorker();
  return (
    <main>
      <Logos />
      <Links />
      <Background />
    </main>
  )
}
