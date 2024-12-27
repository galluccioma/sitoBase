import Script from 'next/script'

import { Inter } from 'next/font/google'
import Header from './components/Globali/Header'
import Footer from './components/Globali/Footer'
import './tailwind.css'
import BannerAggiornamenti from './components/UI/BannerAggiornamenti'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'My Awesome Website',
  description: 'Discover amazing content and services on My Awesome Website',

  // Basic metadata
  applicationName: 'My Awesome App',
  authors: [{ name: 'Antonio Galluccio Mezio', url: 'https://galluccioma.com' }],
  generator: 'Next.js',
  keywords: ['next.js', 'react', 'javascript'],
  referrer: 'origin-when-cross-origin',
  creator: 'Antonio Galluccio Mezio',
  publisher: 'Umazing.it',

  // Open Graph metadata
  openGraph: {
    title: 'My Awesome Website',
    description: 'Discover amazing content and services',
    url: 'https://umazing.it',
    siteName: 'My Awesome Website',
    images: [
      {
        url: 'https://umazing.it/og-image.jpg',
        width: 1200, // This is the recommended size in pixels
        height: 630,
        alt: 'My Awesome Website og-image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter metadata
  twitter: {
    card: 'summary_large_image',
    title: 'My Awesome Website',
    description: 'Discover amazing content and services',
    creator: '@cre8stevedev',
    images: ['https://myawesomewebsite.com/twitter-image.jpg'],
  },

  // Verification for search engines
  // You can get these values from the respective
  // search engines when you submit your site for 
  // indexing
  verification: {
    google: 'google-site-verification=1234567890',
    yandex: 'yandex-verification=1234567890',
    yahoo: 'yahoo-site-verification=1234567890',
  },

  // Alternate languages
  alternates: {
    canonical: 'https://myawesomewebsite.com',
    languages: {
      'it-IT': 'https://myawesomewebsite.com/it-IT',
    },
  },

  // Icons
  icons: {
    icon: '/ico/favicon.ico',
    shortcut: '/ico/favicon.png',
    apple: '/ico/apple-touch-icon-76x76.png',
  },

  // Manifest
  // manifest: '/site.webmanifest',

  // App-specific metadata
  appleWebApp: {
    capable: true,
    title: 'My Awesome App',
    statusBarStyle: 'black-translucent',
  },

  // Robots directives
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Format detection
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it">
       {/* <Head>
    </Head> */}
      <body className={inter.className}>
        <BannerAggiornamenti/>
      <Header/>
        {children}
        <Footer/>
      <Script id='animate' src="/js/animate.js"> </Script>
      <Script id='eggs' src="/js/eggs.js"></Script>
        </body>
    </html>
  )
}