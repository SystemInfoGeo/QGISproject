// MapComponent.tsx
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { LatLngTuple, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from '@mapbox/polyline'; // Pour décoder les polylignes encodées
import 'leaflet-polylinedecorator'; // Pour ajouter des flèches aux polylignes
import { useState, useEffect } from 'react';

interface Point {
  latitude: number;
  longitude: number;
}

interface ItinerairesORS {
  routes: { geometry: string }[]; // Structure d'un itinéraire venant d'ORS (OpenRouteService)
}

interface MapProps {
  points?: Point[];
  optimalPath?: LatLngTuple[];
  itinerairesORS?: ItinerairesORS[];
  binIds?: number[]; // tableau des IDs des poubelles
  onAllCollected: (collected: boolean) => void;
  resetMap: boolean;
}

const MapComponent: React.FC<MapProps> = ({
  points = [],
  optimalPath = [],
  itinerairesORS = [],
  binIds = [],
  onAllCollected,
  resetMap,
}) => {
  const center: LatLngTuple = [36.712776, 4.040093]; // Coordonnées centrales de la carte
  const [collectedPoints, setCollectedPoints] = useState<boolean[]>(Array(points.length).fill(false));
  const [collectedBins, setCollectedBins] = useState<number[]>([]); // Stocker les IDs des poubelles collectées

  // Initialiser collectedPoints au début
  useEffect(() => {
    const initialCollectedPoints = Array(optimalPath.length).fill(false);
    setCollectedPoints(initialCollectedPoints);
  }, [optimalPath]);

  // Vérifier si tous les points du chemin optimal sont collectés
  useEffect(() => {
    const allCollected = collectedPoints.slice(1, -1).every(point => point === true);
    onAllCollected(allCollected); // Activer ou désactiver le bouton "Terminer"
  }, [collectedPoints, onAllCollected]);

  // Réinitialiser la carte
  useEffect(() => {
    if (resetMap) {
      setCollectedPoints(Array(points.length).fill(false));
      setCollectedBins([]); // Réinitialiser les poubelles collectées
    }
  }, [resetMap, points.length]);

  // Fonction appelée au clic sur un point
  const handleMarkerClick = async (index: number) => {
    if (index === 0 || index === optimalPath.length - 1) return; // Empêcher de cliquer sur le départ ou l'arrivée
    if (index > 1 && !collectedPoints[index - 1]) {
      console.log('Le point précédent n\'est pas encore collecté.');
      return; // Ne pas autoriser le clic si le point précédent n'est pas collecté
    }

    // Mettre à jour la couleur du point en local (interface)
    setCollectedPoints(prev => {
      const newCollectedPoints = [...prev];
      newCollectedPoints[index] = true;
      return newCollectedPoints;
    });

    const binId = binIds[index];
    if (!binId) return;

    // Appeler l'API pour mettre à jour le statut dans la base de données
    try {
      const response = await fetch(`http://localhost:5000/update-trash-bin-status/${binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'vide' }),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour du statut');

      // Ajouter l'ID de la poubelle collectée
      setCollectedBins(prev => [...prev, binId]);
      console.log(`Poubelle ${binId} collectée.`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  // Créer des icônes pour les points
  const createIcon = (number: number, color: string = 'red', shape: string = 'circle') => {
    const size = 20;
    const style = shape === 'square'
      ? `background-color: ${color}; color: black; border-radius: 0; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;`
      : `background-color: ${color}; color: black; border-radius: 50%; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;`;

    return divIcon({
      html: `<div style="${style}">${number}</div>`,
      className: '',
    });
  };

  // Décoder les itinéraires ORS
  const decodedPolylines = itinerairesORS.map(itineraire => {
    if (itineraire.routes?.[0]?.geometry) {
      return polyline.decode(itineraire.routes[0].geometry).map(coord => [coord[0], coord[1]] as LatLngTuple);
    }
    return [];
  });

  return (
    <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {optimalPath.map((coord, index) => {
        const isCollected = collectedPoints[index];
        const color = isCollected ? 'green' : 'red';
        return (
          <Marker
            key={index}
            position={coord}
            icon={createIcon(index, color)}
            eventHandlers={{ click: () => handleMarkerClick(index) }}
          />
        );
      })}
      {optimalPath.length > 0 && <Polyline positions={optimalPath} color="blue" />}
      {decodedPolylines.map((poly, index) => (
        <Polyline key={index} positions={poly} color="red" />
      ))}
    </MapContainer>
  );
};

export default MapComponent;
