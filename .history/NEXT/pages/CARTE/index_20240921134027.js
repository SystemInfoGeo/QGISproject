import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Circles } from 'react-loader-spinner';

// Charger la carte de manière dynamique avec SSR (Server Side Rendering) désactivé
const MapComponent = dynamic(() => import('../../components/MapComponent'), { ssr: false });

export default function Carte() {
  const [points, setPoints] = useState([]); // Stocker les points des poubelles
  const [loading, setLoading] = useState(true); // Gérer l'état de chargement
  const [collectedBins, setCollectedBins] = useState([]); // IDs des poubelles collectées
  const [error, setError] = useState(null); // Gérer les erreurs

  // Fonction pour récupérer les points depuis l'API
  const fetchPoints = async () => {
    try {
      const response = await fetch('/trash-status'); 
      if (!response.ok) {
        throw new Error(`Erreur de requête : ${response.statusText}`);
      }
      const data = await response.json();
      setPoints(data); // Stocker les points récupérés dans l'état
      setLoading(false); // Arrêter le chargement
    } catch (err) {
      console.error("Erreur lors de la récupération des poubelles :", err);
      setError('Erreur lors de la récupération des données des poubelles.');
      setLoading(false); // Arrêter le chargement même en cas d'erreur
    }
  };

  // Utiliser useEffect pour appeler fetchPoints au montage du composant
  useEffect(() => {
    fetchPoints();
  }, []);

  // Afficher un message d'erreur si quelque chose tourne mal
  if (error) {
    return (
      <div className="container">
        <h1 className="text-center mt-4">Optimisation des Collectes</h1>
        <p className="text-danger text-center">{error}</p>
      </div>
    );
  }

  // Afficher un indicateur de chargement si les données ne sont pas encore prêtes
  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Circles height="80" width="80" color="#4fa94d" />
      </div>
    );
  }

  // Afficher la carte une fois les données chargées
  return (
    <div className="container">
      <h1 className="text-center mt-4">Optimisation des Collectes</h1>
      <MapComponent points={points} collectedBins={collectedBins} setCollectedBins={setCollectedBins} />
    </div>
  );
}
