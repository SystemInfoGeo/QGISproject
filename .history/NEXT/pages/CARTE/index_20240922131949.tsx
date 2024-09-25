'use client';
import React from 'react';
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


  // Charger les données lors du chargement de la page
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
          
          // Extraire les géométries (polylignes encodées) des itinéraires
          const itinerairesORS = result.itineraires_ors.map((itinerary: any) => {
            return itinerary.routes.map((route:any) => route.geometry); // Extraire les polylignes encodées
          }).flat();

          // Mettre à jour les données avec les itinéraires ORS décodés
          setData({ ...result, itineraires_ors: itinerairesORS });
        } else {
          console.error('Error fetching data:', response.statusText);
          setMessage(`Erreur : ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Erreur lors de la récupération des données, veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, []);

  const handleAllCollected = (collected: boolean) => {
    setAllCollected(collected);
  };

  // Fonction pour terminer la collecte et afficher un message
  const handleFinish = () => {
    if (data && data.points.length > 0) {
      setMessage('Collecte terminée, BRAVO!');
    }
  };

  // Fonction appelée lorsqu'on ferme le message de fin de collecte
  const handleCloseMessage = async () => {
    if (data) {
      try {
        // Envoyer une requête DELETE pour réinitialiser les données sur le serveur
        const response = await fetch('/api/updateStatus', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log('Données réinitialisées avec succès');
        } else {
          console.error('Erreur lors de la réinitialisation des données:', response.statusText);
          setMessage('Erreur lors de la réinitialisation des données.');
        }
      } catch (error) {
        console.error('Erreur lors de la réinitialisation des données:', error);
        setMessage('Erreur lors de la réinitialisation des données.');
      }
    }
    setMessage(null);
    setResetMap(false);
    setAllCollected(false);
    setData(null); // Réinitialiser les données affichées
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
