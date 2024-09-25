'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './carte.module.css';
import { Circles } from 'react-loader-spinner';
import Navbar from '../../components/Navbar';

interface Point {
  latitude: number;
  longitude: number;
}

interface OptimalPathData {
  points: Point[];
  optimal_path: [number, number][];
  itineraires_ors: { routes: { geometry: string }[] }[];
  bin_ids: number[]; 
}

const MapComponent = dynamic(() => import('../../components/MapComponent'), { ssr: false });

export default function Carte() {
  const [data, setData] = useState<OptimalPathData | null>(null);
  const [loading, setLoading] = useState(true);
  const [allCollected, setAllCollected] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [resetMap, setResetMap] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [binIds, setBinIds] = useState<number[]>([]);
  const [collectedBins, setCollectedBins] = useState<number[]>([]);

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

          setPoints(result.points);
          setBinIds(result.bin_ids);

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
        const response = await fetch('/collect-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collectedBins, coordinates: points }),
        });

        if (response.ok) {
          setMessage('Bravo, la collecte est terminée!');
        } else {
          setMessage(`Erreur lors de l'enregistrement : ${response.statusText}`);
        }

        setTimeout(() => {
          setResetMap(true); // Réinitialiser la carte après 3 secondes
          setMessage(null);
        }, 3000);

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
                  collectedBins={collectedBins}
                  setCollectedBins={setCollectedBins}
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
