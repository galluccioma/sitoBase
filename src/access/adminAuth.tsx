// ProtectedLayout.tsx
import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Assicurati che il percorso sia corretto

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/users/me', {
          method: 'GET',
          credentials: 'include', // Include i cookie nella richiesta
        });

        if (!response.ok) {
          // Reindirizza alla pagina di login se non è autenticato
          router.replace('/login');
          return;
        }

        const data = await response.json();

        // Controlla se data e data.user esistono
        if (data && data.user && data.user.role) {
          // Controlla se il ruolo dell'utente è "admin"
          if (data.user.role !== 'admin') {
            router.replace('/admin/login'); // Reindirizza se l'utente non è admin
          }
        } else {
          // Se la struttura non è quella attesa, gestisci l'errore
          console.error('Struttura della risposta API non valida', data);
          router.replace('/admin/login'); // Reindirizza in caso di errore
        }
      } catch (err) {
        console.error(err);
        router.replace('/admin/login'); // Reindirizza in caso di errore
      } finally {
        setLoadingAuth(false); // Imposta loadingAuth a false dopo aver controllato l'autenticazione
      }
    };

    checkAuth();
  }, [router]); // Ricarica se il router cambia

  // Mostra un caricamento durante il controllo dell'autenticazione
  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <h2 className="text-xl">Controllo accesso in corso...</h2>
      </div>
    );
  }

  return <>{children}</>; // Renderizza i figli solo se l'utente è autenticato
};

export default ProtectedLayout;
