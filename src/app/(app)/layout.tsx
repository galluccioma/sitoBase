import type { Metadata } from 'next'
import Head from 'next/head';

import { Inter } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'
import './tailwind.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Backend powered by -io',
  description: 'A starter backend powered by -io.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
       <Head>
      {/* Global Metadata */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="generator" content="Astro" />
      <meta name="robots" content="noindex,nofollow" />

      {/* Primary Metadata */}
      <title>Umazing</title>
      <meta name="title" content='titolo' />
      <meta name="description" content='descrizione' />
      <meta name="keywords" content="siti web torino, siti web italia, e-commerce, campagne ads, SEO, campagne social torino, sviluppo web" />

      {/* Fonts */}
      <link rel="preload" href="/fonts/BricolageGrotesque-VariableFont_opsz,wdth,wght.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />

      {/* Favicon per tutti i dispositivi */}
      <link rel="icon" type="image/x-icon" href="/ico/favicon.ico" />

      {/* Icone Apple Touch */}
      <link rel="apple-touch-icon" sizes="57x57" href="/ico/apple-touch-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/ico/apple-touch-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/ico/apple-touch-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/ico/apple-touch-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/ico/apple-touch-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/ico/apple-touch-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/ico/apple-touch-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/ico/apple-touch-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/ico/apple-touch-icon-180x180.png" />

      {/* Canonical URL */}
      <link rel="canonical" href='https://umazing.it/' />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content='https://umazing.it/ '/>
      <meta property="og:title" content='Umazing'/>
      <meta property="og:description" content='descrizione' />
      <meta property="og:image" content='/' />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content='https://umazing.it/'/>
      <meta property="twitter:title" content='umazinf' />
      <meta property="twitter:description" content='descrizione'/>
      <meta property="twitter:image" content='imamgine' />

      {/* Sitemap */}
      <link rel="sitemap" href="/sitemap-0.xml" />
    </Head>
      <body className={inter.className}>
      <Header/>
        {children}
        <Footer/>
        </body>
    </html>
  )
}