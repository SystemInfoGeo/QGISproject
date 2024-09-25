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
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchPath = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/updateStatus', {
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
          if (response.status === 401) {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, [router]);

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
    <div style={{ padding: '0', margin: '0', fontFamily: 'Arial, sans-serif' }}>
      <Navbar /> {/* Inclusion de la Navbar */}
      
      <main style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'end', minHeight: '100vh', backgroundColor: '#343a40', color: '#fff' }}>
        {loading ? (
          <div style={{ padding: '20px' }}>Chargement...</div>
        ) : (
          <>
            {message && (
              <div style={{ padding: '10px', backgroundColor: '#28a745', borderRadius: '5px', cursor: 'pointer' }} onClick={handleCloseMessage}>
                {message}
              </div>
            )}
            <div style={{ width: '100%', height: '100%' }}>
              <MapComponent 
                points={data ? data.points : []} 
                optimalPath={data ? data.optimal_path : []} 
                onAllCollected={handleAllCollected} 
                resetMap={resetMap}
              />
            </div>
            <button 
              style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer' }} 
              onClick={handleFinish} 
              disabled={!allCollected}
            >
              Terminer
            </button>
          </>
        )}
      </main>

      <footer style={{ backgroundColor: '#343a40', color: '#fff', textAlign: 'center', padding: '10px' }}>
        <p>Contactez-nous pour plus d'informations</p>
        <p>&copy; {new Date().getFullYear()} Clean Zone</p>
      </footer>
    </div>
  );
}
