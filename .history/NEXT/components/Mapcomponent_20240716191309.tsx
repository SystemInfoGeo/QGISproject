import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import { LatLngTuple, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Point {
  latitude: number;
  longitude: number;
}

interface MapProps {
  points?: Point[];
  optimalPath?: LatLngTuple[];
}

const MapComponent: React.FC<MapProps> = ({ points = [], optimalPath = [] }) => {
  const center: LatLngTuple = [36.712776, 4.040093]; // Coordonnées du centre de la carte

  const [collectedPoints, setCollectedPoints] = useState<boolean[]>(Array(points.length + 2).fill(false));

  useEffect(() => {
    setCollectedPoints(Array(points.length + 2).fill(false)); // Reset collectedPoints if points change
  }, [points]);

  const handleMarkerClick = (index: number) => {
    if (index === 0 || index === optimalPath.length - 1) {
      // Point de départ et d'arrivée ne sont pas cliquables
      return;
    }

    // Vérifiez si le point précédent est vert
    if (index > 1 && !collectedPoints[index - 1]) {
      return;
    }

    setCollectedPoints((prev) => {
      const newCollectedPoints = [...prev];
      newCollectedPoints[index] = true; // Une fois cliqué, le point devient vert et reste vert
      return newCollectedPoints;
    });
  };

  const createIcon = (number: number, color: string = 'red', shape: string = 'circle') => {
    const size = 20;
    const style = shape === 'square'
      ? `background-color: ${color}; color: black; border-radius: 0; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;`
      : `background-color: ${color}; color: black; border-radius: 50%; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;`;
    
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
          pointNumber = 0; // Point de départ
          shape = 'square';
          color = 'white';
          isClickable = false;
        } else if (index === optimalPath.length - 1) {
          pointNumber = optimalPath.length; // Point d'arrivée
          shape = 'square';
          color = 'black';
          isClickable = false;
        } else {
          pointNumber = index;
        }

        const isCollected = collectedPoints[index];
        if (isCollected) {
          color = 'green';
          isClickable = false; // Une fois le point cliqué, il va devenir non cliquable
        }

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
