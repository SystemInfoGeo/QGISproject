import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { LatLngTuple, divIcon } from 'leaflet';
import polyline from '@mapbox/polyline';
import 'leaflet-polylinedecorator';
import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect } from 'react';

interface Point {
  latitude: number;
  longitude: number;
}

interface ItinerairesORS {
  routes: { geometry: string }[];
}

interface MapProps {
  points?: Point[];
  optimalPath?: LatLngTuple[];
  itinerairesORS?: ItinerairesORS[];
  binIds?: number[];
  onAllCollected: (collected: boolean) => void;
  resetMap: boolean;
  collectedBins: number[]; // Ajout de collectedBins ici
  setCollectedBins: React.Dispatch<React.SetStateAction<number[]>>; // Ajout de setCollectedBins ici
}

const MapComponent: React.FC<MapProps> = ({
  points = [],
  optimalPath = [],
  itinerairesORS = [],
  binIds = [],
  onAllCollected,
  resetMap,
  collectedBins, // Ajout de collectedBins ici
  setCollectedBins // Ajout de setCollectedBins ici
}) => {
  const center: LatLngTuple = [36.712776, 4.040093];
  const [collectedPoints, setCollectedPoints] = useState<boolean[]>(Array(points.length).fill(false));

  useEffect(() => {
    const initialCollectedPoints = Array(optimalPath.length).fill(false);
    setCollectedPoints(initialCollectedPoints);
  }, [optimalPath]);

  useEffect(() => {
    const allCollected = collectedPoints.slice(1, -1).every(point => point === true);
    onAllCollected(allCollected);
  }, [collectedPoints, onAllCollected]);

  useEffect(() => {
    if (resetMap) {
      setCollectedPoints(Array(points.length).fill(false));
    }
  }, [resetMap, points.length]);


  
  
  const handleMarkerClick = async (index: number) => {
    // Vérifiez si binIds existe et contient un ID pour ce point
    if (!binIds || !binIds[index]) {
      console.error('ID de la poubelle introuvable pour ce point');
      alert('ID de la poubelle introuvable pour ce point');
      return;
    }
  
    // Récupérer l'ID de la poubelle
    const binId = binIds[index];
  
    try {
      // Effectuer une requête pour mettre à jour le statut de la poubelle
      const response = await fetch(`http://localhost:5000/update-trash-bin-status/${binId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'vide'  // Mettre à jour le statut à 'vide'
        }),
      });
  
      if (response.ok) {
        console.log(`Statut de la poubelle ${binId} mis à jour avec succès`);
      } else {
        console.error('Erreur lors de la mise à jour du statut :', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut :', error);
    }
  };
  
 

  const createIcon = (number: number, color: string = 'red') => {
    const size = 20;
    return divIcon({
      html: `<div style="background-color: ${color}; color: black; border-radius: 50%; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">${number}</div>`,
      className: ''
    });
  };

  const decodedPolylines = itinerairesORS.map(itineraire => {
    if (itineraire.routes && itineraire.routes.length > 0 && itineraire.routes[0].geometry) {
      return polyline.decode(itineraire.routes[0].geometry).map(coord => [coord[0], coord[1]] as LatLngTuple);
    }
    return [];
  });

  return (
    <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {optimalPath.map((coord, index) => {
        let pointNumber = index;
        let color = 'red';

        if (index === 0 || index === optimalPath.length - 1) {
          pointNumber = index === 0 ? 0 : optimalPath.length;
          color = index === 0 ? 'white' : 'black';
        }

        const isCollected = collectedPoints[index];
        if (isCollected) {
          color = 'green';
        }

        return (
          <Marker
            key={index}
            position={coord}
            icon={createIcon(pointNumber, color)}
            eventHandlers={{
              click: () => handleMarkerClick(index)
            }}
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
