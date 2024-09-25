import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Circles } from 'react-loader-spinner'; // Pour l'indicateur de chargement
import styles from './carte.module.css';

const MapComponent = dynamic(() => import('../../components/MapComponent'), {
  ssr: false,
});

export default function Carte() {
  const [points, setPoints] = useState([]); // Stocker les points de collecte
  const [binIds, setBinIds] = useState<number[]>([]); // Stocker les IDs des poubelles
  const [data, setData] = useState<any>(null); // Stocker les données du chemin optimal
  const [loading, setLoading] = useState(true);
  const [allCollected, setAllCollected] = useState(false); // État pour indiquer si tous les points sont collectés
  const [message, setMessage] = useState<string | null>(null); // Message pour afficher le statut

  useEffect(() => {
    const fetchTrashBins = async () => {
      try {
        const response = await fetch('http://localhost:5000/get_all-trash-bins', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          setPoints(result.map((point: any) => ({ latitude: point.latitude, longitude: point.longitude })));
          setBinIds(result.map((point: any) => point.id));
        } else {
          console.error('Erreur lors de la récupération des points de collecte');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des points de collecte', error);
      }
    };

    fetchTrashBins();
    setLoading(false);
  }, []);

  // Fonction pour gérer la collecte de tous les points
  const handleAllCollected = (collected: boolean) => {
    setAllCollected(collected);
  };

  const handleFinish = () => {
    if (allCollected) {
      setMessage('Collecte terminée, BRAVO !');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Chemin de Collecte Optimisé</h1>
      </header>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.loader}>
            <Circles height="80" width="80" color="#4fa94d" />
          </div>
        ) : (
          <>
            {message && <div className={styles.message}>{message}</div>}
            <MapComponent
              points={points}
              optimalPath={data ? data.optimal_path : []}
              itinerairesORS={data ? data.itineraires_ors : []}
              binIds={binIds}
              onAllCollected={handleAllCollected}
              resetMap={false}
            />
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
        <p>&copy; {new Date().getFullYear()} Clean Zone</p>
      </footer>
    </div>
  );
}
