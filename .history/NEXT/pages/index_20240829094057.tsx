import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';  // Importation de Bootstrap

const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
});


interface Point {
  latitude: number;
  longitude: number;
}

interface OptimalPathData {
  points: Point[];
  optimal_path: [number, number][];
}

export default function Collect() {
  const [data, setData] = useState<OptimalPathData | null>(null);
  const [loading, setLoading] = useState(true);
  const [allCollected, setAllCollected] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
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
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, [router]);

  useEffect(() => {
    console.log("Data loaded:", data);
    console.log("Loading state:", loading);
  }, [data, loading]);

  const handleAllCollected = (collected: boolean) => {
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
    <div className="container-fluid">
      {/* Barre de menu */}
      <header className="d-flex justify-content-between align-items-center p-3 bg-success text-white shadow-sm">
        <div className="d-flex align-items-center">
          <img src="/images/logo.jpg" alt="Logo" width={40} height={40} className="me-3" />
          <h1 className="h4 m-0">Cartographier pour mieux collecter</h1>
        </div>
        <nav>
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link text-white" href="/">Accueil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" href="#about">À propos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" href="/login">Se connecter</Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Contenu principal */}
      <main className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
        {loading ? (
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        ) : (
          <>
            {message && (
              <div className="alert alert-success" role="alert" onClick={handleCloseMessage}>
                {message}
              </div>
            )}
            <div className="w-100" style={{ height: '60vh' }}>
              <MapComponent 
                points={data ? data.points : []} 
                optimalPath={data ? data.optimal_path as LatLngTuple[] : []} 
                onAllCollected={handleAllCollected} 
                resetMap={resetMap}
              />
            </div>
            <button 
              className="btn btn-success mt-3" 
              onClick={handleFinish} 
              disabled={!allCollected}
            >
              Terminer
            </button>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white text-center p-3 mt-auto">
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
