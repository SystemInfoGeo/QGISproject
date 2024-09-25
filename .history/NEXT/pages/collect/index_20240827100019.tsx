// pages/collect/index.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './collect.module.css'; // Chemin corrigé pour collect.module.css
import dynamic from 'next/dynamic';
import { LatLngTuple } from 'leaflet';
import Link from 'next/link';

const MapComponent = dynamic(() => import('../../components/MapComponent'), {
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
  const router = useRouter(); // Pour la redirection

  useEffect(() => {
    const checkAuth = () => {
      // Vérifier si le token est présent dans le localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        // Rediriger vers la page de connexion si aucun token
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchPath = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Rediriger vers la page de connexion si aucun token
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/updateStatus', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Envoyer le token JWT
          },
        });
        if (response.ok) {
          const result = await response.json();
          console.log('Data received:', result); 
          setData(result);
        } else {
          console.error('Error fetching data:', response.statusText);
          if (response.status === 401) {
            // Rediriger vers la page de connexion si le token est invalide
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
    console.log("Data loaded:", data); // Vérifiez les données reçues
    console.log("Loading state:", loading); // Vérifiez si la carte est toujours en chargement
  }, [data, loading]);

  const handleAllCollected = (collected: boolean) => {
    setAllCollected(collected);
    console.log('All collected status:', collected); 
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
      console.log('Map reset initiated');
      setResetMap(false);
    }
  }, [resetMap]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img src="/images/logo.jpg" alt="Logo" width={40} height={40} />
          <h1>Cartographier pour mieux collecter</h1>
        </div>
        
        <nav className={styles.nav}>
           <ul>
             <li><Link href="/">Accueil</Link></li>
             <li><Link href="#about">À propos</Link></li>
             <li><Link href="/login">Se connecter</Link></li>
            </ul>
        </nav>
      </header>
      <main className={styles.main}>
        {loading ? (
          <div className={styles.loader}>Chargement...</div>
        ) : (
          <>
            {message && (
              <div className={styles.message} onClick={handleCloseMessage}>
                {message}
              </div>
            )}
            <div className={styles.map}>
              <MapComponent 
                points={data ? data.points : []} 
                optimalPath={data ? data.optimal_path as LatLngTuple[] : []} 
                onAllCollected={handleAllCollected} 
                resetMap={resetMap}
              />
            </div>
            <button 
              className={styles.finishButton} 
              onClick={handleFinish} 
              disabled={!allCollected}
            >
              Terminer
            </button>
          </>
        )}
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
