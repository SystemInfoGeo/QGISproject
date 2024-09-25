import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importer Bootstrap pour le style
import Navbar from '../components/Navbar'; // Importer le composant Navbar

const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
});

export default function Carte() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allCollected, setAllCollected] = useState(false);
  const [message, setMessage] = useState(null); 
  const [resetMap, setResetMap] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Log pour vérifier si le token est bien récupéré

    if (!token) {
      console.log('Token absent, redirection vers la page de connexion.');
      router.push('/login');
    } else {
      console.log('Token présent, vérification avec le serveur...');
      fetch('/api/protected-map', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Réponse du serveur pour /api/protected-map:', response); // Log la réponse du serveur
        if (!response.ok) {
          setMessage('Accès refusé. Redirection vers la page de connexion...');
          console.log('Accès refusé, redirection vers /login');
          router.push('/login');
        } else {
          console.log('Accès accordé, récupération des données...');
          fetchPath();
        }
      })
      .catch((error) => {
        console.log('Erreur lors de la vérification de l\'authentification:', error);
        setMessage('Erreur lors de la vérification de l\'authentification.');
        router.push('/login');
      });
    }
  }, [router]);

  const fetchPath = async () => {
    const token = localStorage.getItem('token');
    try {
      console.log('Tentative de récupération des données avec le token:', token);
      const response = await fetch('/api/updateStatus', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Données récupérées:', result); // Log les données récupérées
        setData(result);
      } else {
        console.error('Erreur lors de la récupération des données:', response.statusText);
        if (response.status === 401) {
          console.log('Jeton non valide ou expiré, redirection vers /login');
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Données chargées:", data); 
    console.log("État de chargement:", loading);
  }, [data, loading]);

  const handleAllCollected = (collected) => {
    setAllCollected(collected);
    console.log('Tous les points sont collectés:', collected);
  };

  const handleFinish = () => {
    if (data && data.points.length > 0) {
      console.log('Terminer button clicked. Data:', data); 
      setMessage('Collecte terminée, BRAVO!');
    }
  };

  const handleCloseMessage = () => {
    setMessage(null);
    setResetMap(true);
    setAllCollected(false);
    setData(null); 
  };

  useEffect(() => {
    if (resetMap) {
      console.log('Réinitialisation de la carte...');
      setResetMap(false);
    }
  }, [resetMap]);

  return (
    <div className="container-fluid p-0">
      <Navbar /> {/* Inclusion de la Navbar */}
      
      <main className="position-relative d-flex flex-column align-items-center justify-content-end vh-100 bg-dark text-white">
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <>
            {message && (
              <div onClick={handleCloseMessage}>
                {message}
              </div>
            )}
            <div>
              <MapComponent 
                points={data ? data.points : []} 
                optimalPath={data ? data.optimal_path : []} 
                onAllCollected={handleAllCollected} 
                resetMap={resetMap}
              />
            </div>
            <button 
              onClick={handleFinish} 
              disabled={!allCollected}
            >
              Terminer
            </button>
          </>
        )}
      </main>

      <footer className="bg-dark text-white text-center py-3">
        <p>Contactez-nous pour plus d'informations</p>
        <p>&copy; {new Date().getFullYear()} Clean Zone</p>
      </footer>
    </div>
  );
}
