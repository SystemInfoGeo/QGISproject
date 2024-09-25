import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Circles } from 'react-loader-spinner';

// Charger la carte de manière dynamique avec SSR désactivé
const MapComponent = dynamic(() => import('../../components/MapComponent'), { ssr: false });

export default function Carte() {
  const [points, setPoints] = useState([]); // Stocker les points des poubelles
  const [loading, setLoading] = useState(true); // Gérer l'état de chargement
  const [collectedBins, setCollectedBins] = useState([]); // IDs des poubelles collectées
  const [error, setError] = useState(null); // Gérer les erreurs

  // Fonction dédiée pour l'appel d'API
  const fetchData = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Erreur de requête : ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      throw new Error(`Erreur lors de l'appel à ${url} : ${err.message}`);
    }
  };

  // Fonction pour récupérer les points depuis l'API et calculer l'itinéraire
  const fetchPointsAndRoute = async () => {
    try {
      const pointsData = await fetchData('http://localhost:5000/trash-status');
      console.log('Données reçues des poubelles:', pointsData);

      // Vérifiez si les points contiennent des coordonnées valides
      const validPoints = pointsData.filter(point => point.latitude && point.longitude);
      if (validPoints.length === 0) {
        throw new Error("Aucun point valide trouvé");
      }

      // Préparer les données pour l'API de calcul d'itinéraire
      const coordinates = validPoints.map(point => [point.longitude, point.latitude, point.status]);
      const routeData = await fetchData('http://localhost:5000/calculate-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coordinates }),
      });

      setPoints(routeData.optimal_path);
    } catch (err) {
      console.error("Erreur :", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Utiliser useEffect pour appeler fetchPointsAndRoute au montage du composant
  useEffect(() => {
    fetchPointsAndRoute();
  }, []);

  // Afficher un message d'erreur si quelque chose tourne mal
  if (error) {
    return (
      <div className="container">
        <h1 className="text-center mt-4">Optimisation des Collectes</h1>
        <p className="text-danger text-center">{error}</p>
        <button className="btn btn-primary" onClick={fetchPointsAndRoute}>Réessayer</button>
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
