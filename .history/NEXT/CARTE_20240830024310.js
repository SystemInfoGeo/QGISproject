import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Carte = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      fetch('/api/protected-map', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) {
          setError('Accès refusé. Redirection vers la page de connexion...');
          router.push('/login');
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setError('Erreur lors de la vérification de l\'authentification.');
        router.push('/login');
      });
    }
  }, [router]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Carte Géographique</h1>
      <p>Votre carte sera ici</p>
    </div>
  );
};

export default Carte;
