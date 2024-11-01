
import { useEffect } from 'react';

export default function useServiceWorker() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrato con successo:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registrazione fallita:', error);
        });
    }
  }, []);
}