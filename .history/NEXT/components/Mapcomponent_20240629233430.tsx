/*import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { LatLngTuple, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Point {
  latitude: number;
  longitude: number;
}

interface MapProps {
  points: Point[];
  optimalPath: LatLngTuple[];
}

const MapComponent: React.FC<MapProps> = ({ points, optimalPath }) => {
  const center: LatLngTuple = [36.712776, 4.040093]; // Coordonnées du centre de la carte

  // Function to create a custom icon with a number
  const createIcon = (number: number, color: string = 'red') => {
    return divIcon({
      html: `<div style="background-color: ${color}; color: black; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">${number}</div>`,
      className: ''
    });
  };

  return (
    <MapContainer center={center} zoom={10} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {optimalPath.map((coord, index) => (
        <Marker
          key={`optimal-${index}`}
          position={coord as LatLngTuple}
          icon={createIcon(index === 0 || index === optimalPath.length - 1 ? 1 : index + 1, index === 0 || index === optimalPath.length - 1 ? 'red' : 'red')}
        />
      ))}
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
*/




import React from 'react';
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
}

const MapComponent: React.FC<MapProps> = ({ points = [], optimalPath = [] }) => {
  const center: LatLngTuple = [36.712776, 4.040093]; // Coordonnées du centre de la carte

  // Function to create a custom icon with a number
  const createIcon = (number: number, color: string = 'red') => {
    return divIcon({
      html: `<div style="background-color: ${color}; color: black; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">${number}</div>`,
      className: ''
    });
  };

  return (
    <MapContainer center={center} zoom={10} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {optimalPath.map((coord, index) => {
        const isStartOrEnd = index === 0 || index === optimalPath.length - 1;
        const pointNumber = isStartOrEnd ? 1 : index + 1;
        return (
          <Marker
            key={`optimal-${index}`}
            position={coord as LatLngTuple}
            icon={createIcon(pointNumber, 'red')}
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
