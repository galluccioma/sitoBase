// layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.scss'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Backend powered by -io',
  description: 'A starter backend powered by -io.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/ico/apple-touch-icon-180x180.png" />
        <meta name="theme-color" content="#61CE70" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
