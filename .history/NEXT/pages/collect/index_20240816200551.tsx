// pages/collect/index.tsx
import { useState, useEffect } from 'react';
import styles from './collect.module.css'; // Chemin corrigé pour collect.module.css
import dynamic from 'next/dynamic';
import { LatLngTuple } from 'leaflet';

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

  useEffect(() => {
    const fetchPath = async () => {
      try {
        const response = await fetch('/api/updateStatus', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const result = await response.json();
          console.log('Data received:', result); 
          setData(result);
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, []);

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
            <li><a href="/">Accueil</a></li>
            <li><a href="#about">À propos</a></li>
            <li><a href="#se connecter">Se connecter</a></li>
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
