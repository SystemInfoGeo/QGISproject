import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Point {
  latitude: number;
  longitude: number;
}

interface OptimalPathData {
  optimal_path: Point[];
}

interface MapProps {
  data: OptimalPathData | null;
}

const MapComponent: React.FC<MapProps> = ({ data }) => {
  const center: [number, number] = [36.712776, 4.040093]; // Coordonnées du centre de la carte

  useEffect(() => {
    console.log('MapComponent data:', data); // Log the data received by MapComponent
  }, [data]);

  return (
    <MapContainer center={center} zoom={10} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {data && data.optimal_path.map((point, index) => (
        <Marker key={index} position={[point.latitude, point.longitude]}>
          <Popup>
            Point {index + 1}: ({point.latitude}, {point.longitude})
          </Popup>
        </Marker>
      ))}
      {data && (
        <Polyline
          positions={data.optimal_path.map(point => [point.latitude, point.longitude])}
          color="red"
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
