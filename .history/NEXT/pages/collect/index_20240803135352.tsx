'use client';

import { useState, useEffect } from 'react';
import styles from './collect.module.css';
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
  const [message, setMessage] = useState<string | null>(null); // Nouveau state pour le message
  const [resetMap, setResetMap] = useState(false); // Nouveau state pour réinitiallliser la carte


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


  const handleAllCollected = (collected: boolean) => {
    setAllCollected(collected);
  };

  const handleFinish = () => {
    if (data && data.points.length > 0) {
      setMessage('Collecte terminée, BRAVO!'); // Afficher le message
    }
  };

  const handleCloseMessage = async () => {
    if (data) {
      try {
        const response = await fetch('http://localhost:5000/save-path', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          console.log('Path saved successfully');
        } else {
          console.error('Error saving path:', response.statusText);
        }
      } catch (error) {
        console.error('Error saving path:', error);
      }
    }
    setMessage(null); // pour qu'on cacher le message
    setResetMap(true); // Réinitialiser la carte après avoir caché le message
    setAllCollected(false); // Réinitialiser l'état de collecte
    setData(null); // Réinitialiser les données
  };

  useEffect(() => {
    if (resetMap) {
      setResetMap(false);
    }
  }, [resetMap]);


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Chemin de Collecte Optimisé</h1>
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
            )} {/*Afficher le message */}
          <div className={styles.map}>
            <MapComponent 
              points={data ? data.points : []} 
              optimalPath={data ? data.optimal_path as LatLngTuple[] : []}
              onllCollected={handleAllCollected}
              resetMap={resetMap} // Passer la prop pour réinitialiser la carte
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
