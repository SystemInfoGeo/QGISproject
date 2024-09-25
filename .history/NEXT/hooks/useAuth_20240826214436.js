import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';

const ProtectedPage = () => {
  const authenticated = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authenticated) {
      router.push('/login'); // Rediriger l'utilisateur s'il n'est pas authentifié
    }
  }, [authenticated, router]);

  return (
    <>
      {authenticated ? (
        <div>Contenu de la page protégée</div>
      ) : (
        <div>Redirection en cours...</div>
      )}
    </>
  );
};

export default ProtectedPage;
