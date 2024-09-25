// Carte.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './carte.module.css';
import { LatLngTuple } from 'leaflet';
import { Circles } from 'react-loader-spinner';
import Navbar from '../../components/Navbar';

const MapComponent = dynamic(() => import('../../components/MapComponent'), { ssr: false });
// Définir le type Point en haut de votre fichier
interface Point {
  latitude: number;
  longitude: number;
}

// Définir le type OptimalPathData en haut de votre fichier
interface OptimalPathData {
  points: {
    latitude: number;
    longitude: number;
  }[];
  optimal_path: [number, number][]; // Chemin optimal sous forme de tableau de coordonnées
  itineraires_ors: {
    routes: {
      geometry: string; // Géométrie des itinéraires sous forme de chaîne encodée
    }[];
  }[];
  bin_ids: number[]; // Tableau des IDs des poubelles
}



export default function Carte() {
  const [data, setData] = useState<OptimalPathData | null>(null);
  const [loading, setLoading] = useState(true);
  const [allCollected, setAllCollected] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [resetMap, setResetMap] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [binIds, setBinIds] = useState<number[]>([]); // Stocker les IDs des poubelles collectées
  const [collectedBins, setCollectedBins] = useState<number[]>([]); // Stocker les IDs des poubelles collectées

  // Charger les données de la carte au démarrage
  useEffect(() => {
    const fetchUpdateStatus = async () => {
      try {
        const response = await fetch('/api/updateStatus', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const result = await response.json();
          const itinerairesORS = result.itineraires_ors.flatMap(itinerary =>
            itinerary.routes.map(route => route.geometry)
          );

          setData({
            ...result,
            itineraires_ors: itinerairesORS,
          });
        } else {
          setMessage(`Erreur : ${response.statusText}`);
        }
      } catch (error) {
        setMessage('Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };
    fetchUpdateStatus();
  }, []);

  const handleAllCollected = (collected: boolean) => {
    setAllCollected(collected);
  };

  const handleFinish = async () => {
    if (allCollected) {
      try {
        const response = await fetch('/api/collect-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collectedBins, coordinates: points }),
        });

        if (response.ok) {
          setMessage('Collecte terminée avec succès. Points enregistrés.');
        } else {
          setMessage(`Erreur lors de l'enregistrement : ${response.statusText}`);
        }
      } catch (error) {
        setMessage('Erreur lors de l\'enregistrement.');
      }
    } else {
      setMessage('Veuillez collecter tous les points avant de terminer.');
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <main className={styles.main}>
          {loading ? (
            <Circles height="80" width="80" color="#4fa94d" />
          ) : (
            <>
              {message && (
                <div className={styles.message} onClick={() => setMessage(null)}>
                  {message}
                </div>
              )}
              <h2>Chemin de Collecte Optimisé</h2>
              <div className={styles.map}>
                <MapComponent
                  points={points}
                  optimalPath={data?.optimal_path || []}
                  itinerairesORS={data?.itineraires_ors || []}
                  binIds={binIds}
                  onAllCollected={handleAllCollected}
                  resetMap={resetMap}
                />
              </div>
              <button className={styles.finishButton} onClick={handleFinish} disabled={!allCollected}>
                Terminer
              </button>
            </>
          )}
        </main>
        <footer className={styles.footer}>
          <p>Contactez-nous pour plus d'informations</p>
          <p>&copy; {new Date().getFullYear()} Clean Zone</p>
        </footer>
      </div>
    </>
  );
}
