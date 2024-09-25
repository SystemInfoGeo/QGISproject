'use client';

import { useState, useEffect } from 'react';
import styles from './collect.module.css';
import dynamic from 'next/dynamic';
import { LatLngTuple } from 'leaflet';
import { useRouter } from 'next/navigation';

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
  const [resetMap, setResetMap] = useState(false); // Nouveau state pour réinitialiser la carte
  const router = useRouter(); // Utiliser le hook useRouter pour la navigation

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
    console.log('All collected status:', collected); // Log pour vérifier l'état de collecte
  };

  const handleFinish = () => {
    if (data && data.points.length > 0) {
      console.log('Terminer button clicked. Data:', data); // Log pour vérifier les données au moment de terminer
      setMessage('Collecte terminée, BRAVO!'); // Afficher le message
    }
  };

  const handleCloseMessage = () => {
    // Supprimer l'envoi des données au serveur et simplifier la fonction
    setMessage(null); // Pour cacher le message
    setResetMap(true); // Réinitialiser la carte après avoir caché le message
    setAllCollected(false); // Réinitialiser l'état de collecte
    setData(null); // Réinitialiser les données
  };

  useEffect(() => {
    if (resetMap) {
      console.log('Map reset initiated'); // Log pour vérifier la réinitialisation de la carte
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
            <li><a href="/collect">Carte des Collectes</a></li>
            <li><a href="/historique">Historique des Collectes</a></li>
            <li><a href="/about">À propos</a></li>
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
            )} {/* Afficher le message */}
            <div className={styles.map}>
              <MapComponent 
                points={data ? data.points : []} 
                optimalPath={data ? data.optimal_path as LatLngTuple[] : []} 
                onAllCollected={handleAllCollected} 
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
