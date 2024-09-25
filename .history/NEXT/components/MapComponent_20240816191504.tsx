import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { LatLngTuple, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Point {
  latitude: number;
  longitude: number;
}

interface MapProps {
  points?: Point[];
  optimalPath?: LatLngTuple[];
  onAllCollected: (collected: boolean) => void;
  resetMap: boolean; // Nouvelle prop
}

const MapComponent: React.FC<MapProps> = ({ points = [], optimalPath = [], onAllCollected, resetMap }) => {
  const center: LatLngTuple = [36.712776, 4.040093];
  const [collectedPoints, setCollectedPoints] = useState<boolean[]>(Array(points.length + 2).fill(false));

  useEffect(() => {
    console.log('Points updated:', points);
    setCollectedPoints(Array(points.length + 2).fill(false)); // Réinitialisez collectedPoints si les points changent
  }, [points]);

  useEffect(() => {
    const allCollected = collectedPoints.slice(1, collectedPoints.length - 1).every(point => point);
    onAllCollected(allCollected);
  }, [collectedPoints, onAllCollected]);

  useEffect(() => {
    if (resetMap) {
      console.log('Resetting map');
      setCollectedPoints(Array(points.length + 2).fill(false));
    }
  }, [resetMap, points.length]);

  const handleMarkerClick = (index: number) => {
    if (index === 0 || index === optimalPath.length - 1) {
      return;
    }
    if (index > 1 && !collectedPoints[index - 1]) {
      return;
    }
    setCollectedPoints((prev) => {
      const newCollectedPoints = [...prev];
      newCollectedPoints[index] = true;
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
        console.log(`Optimal Path Point ${index}:`, coord); // Ajoutez ceci pour vérifier les coordonnées des points
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
