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

    if (!token) {
      router.push('/login');
    } else {
      fetch('/protected-map', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) {
          setMessage('Accès refusé. Redirection vers la page de connexion...');
          router.push('/login');
        } else {
          fetchPath();
        }
      })
      .catch(() => {
        setMessage('Erreur lors de la vérification de l\'authentification.');
        router.push('/login');
      });
    }
  }, [router]);

  const fetchPath = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/updateStatus', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        console.error('Error fetching data:', response.statusText);
        if (response.status === 401) {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Data loaded:", data); 
    console.log("Loading state:", loading);
  }, [data, loading]);

  const handleAllCollected = (collected) => {
    setAllCollected(collected);
  };

  const handleFinish = () => {
    if (data && data.points.length > 0) {
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
      console.log('Map reset initiated');
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
