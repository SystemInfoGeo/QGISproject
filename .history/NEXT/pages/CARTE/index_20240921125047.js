import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';
/*import styles from './carte.module.css';  // Si vous avez des styles spécifiques*/
import { Circles } from 'react-loader-spinner';

// Charger la carte de manière dynamique
const MapComponent = dynamic(() => import('../../components/MapComponent'), { ssr: false });

export default function Carte() {
  const [points, setPoints] = useState([]); // Stocker les poubelles
  const [loading, setLoading] = useState(true);  // Gérer l'état de chargement
  const [collectedBins, setCollectedBins] = useState([]);  // IDs des poubelles collectées

  // Charger les données des poubelles depuis l'API
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await fetch('/api/updateStatus');  // Appel API local
        const data = await response.json();
        setPoints(data);
        setLoading(false);  // Arrêter le chargement
      } catch (error) {
        console.error("Erreur lors de la récupération des poubelles", error);
        setLoading(false);
      }
    };

    fetchPoints();
  }, []);

  return (
    <div className="container">
      <h1 className="text-center mt-4">Optimisation des Collectes</h1>
      {loading ? (
        <div className="d-flex justify-content-center mt-5">
          <Circles height="80" width="80" color="#4fa94d" />
        </div>
      ) : (
        <MapComponent points={points} collectedBins={collectedBins} setCollectedBins={setCollectedBins} />
      )}
    </div>
  );
}
