import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { LatLngTuple, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importation des icônes manuellement
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Point {
  latitude: number;
  longitude: number;
}

interface MapProps {
  points?: Point[];
  optimalPath?: LatLngTuple[];
  onAllCollected: (collected: boolean) => void;
  resetMap: boolean;
}

const MapComponent: React.FC<MapProps> = ({ points = [], optimalPath = [], onAllCollected, resetMap }) => {
  const center: LatLngTuple = [36.712776, 4.040093];
  const [collectedPoints, setCollectedPoints] = useState<boolean[]>(Array(points.length + 2).fill(false));
  const role = localStorage.getItem('role');  // Récupérer le rôle stocké

  useEffect(() => {
    console.log("Points reçus:", points); // Log pour vérifier les points reçus
    setCollectedPoints(Array(points.length + 2).fill(false));
  }, [points]);

  useEffect(() => {
    const allCollected = collectedPoints.slice(1, collectedPoints.length - 1).every(point => point);
    console.log("Tous les points sont collectés:", allCollected); // Log pour vérifier si tous les points sont collectés
    onAllCollected(allCollected);
  }, [collectedPoints, onAllCollected]);

  useEffect(() => {
    if (resetMap) {
      console.log("Réinitialisation de la carte..."); // Log pour la réinitialisation de la carte
      setCollectedPoints(Array(points.length + 2).fill(false));
    }
  }, [resetMap, points.length]);

  const handleMarkerClick = (index: number) => {
    if (role !== 'agent_collecte') {
      alert("Vous n'êtes pas autorisé à effectuer cette action");
      console.log("Action refusée: rôle non autorisé:", role); // Log pour action refusée
      return;
    }

    if (index === 0 || index === optimalPath.length - 1) {
      console.log("Le marqueur de début/fin ne peut pas être collecté:", index); // Log pour marqueur non collectable
      return;
    }
    if (index > 1 && !collectedPoints[index - 1]) {
      console.log("Le point précédent n'est pas collecté, index actuel:", index); // Log si le point précédent n'est pas collecté
      return;
    }
    setCollectedPoints((prev) => {
      const newCollectedPoints = [...prev];
      newCollectedPoints[index] = true;
      console.log("Point collecté, index:", index); // Log pour point collecté
      return newCollectedPoints;
    });
  };

  const createIcon = (number: number, color: string = 'red', shape: string = 'circle') => {
    const size = 20;
    const style = shape === 'square'
      ? `background-color: ${color}; color: black; border-radius: 0; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;`
      : `background-color: ${color}; color: black; border-radius: 50%; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;`;

    console.log("Création d'une icône:", { number, color, shape }); // Log pour la création d'une icône
    return divIcon({
      html: `<div style="${style}">${number}</div>`,
      className: ''
    });
  };

  return (
    <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {optimalPath.map((coord, index) => {
        let pointNumber;
        let shape = 'circle';
        let color = 'red';
        let isClickable = true;

        if (index === 0) {
          pointNumber = 0;
          shape = 'square';
          color = 'white';
          isClickable = false;
        } else if (index === optimalPath.length - 1) {
          pointNumber = optimalPath.length;
          shape = 'square';
          color = 'black';
          isClickable = false;
        } else {
          pointNumber = index;
        }

        const isCollected = collectedPoints[index];
        if (isCollected) {
          color = 'green';
          isClickable = false;
        }

        console.log("Ajout du marqueur à la carte:", { index, coord, isClickable, color }); // Log pour l'ajout du marqueur
        return (
          <Marker
            key={`optimal-${index}`}
            position={coord as LatLngTuple}
            icon={createIcon(pointNumber, color, shape)}
            eventHandlers={{
              click: () => isClickable && handleMarkerClick(index),
            }}
          />
        );
      })}
      {optimalPath.length > 0 && (
        <Polyline
          positions={optimalPath}
          color="blue"
        />
      )}
    </MapContainer> 
  );
};

export default MapComponent;
