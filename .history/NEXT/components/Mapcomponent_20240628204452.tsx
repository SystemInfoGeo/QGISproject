/*import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Point {
  latitude: number;
  longitude: number;
}

interface OptimalPathData {
  points: Point[];
  optimal_path: Point[];
}

interface MapProps {
  data: OptimalPathData | null;
}

const MapComponent: React.FC<MapProps> = ({ data }) => {
  const center: [number, number] = [36.712776, 4.040093]; // Coordonnées du centre de la carte
  const [allPoints, setAllPoints] = useState<Point[]>([]);

  useEffect(() => {
    if (data) {
      setAllPoints(data.points);
    }
  }, [data]);

  return (
    <MapContainer center={center} zoom={10} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {allPoints.map((point, index) => (
        <Marker key={index} position={[point.latitude, point.longitude]}>
          <Popup>
            Point {index + 1}: ({point.latitude}, {point.longitude})
          </Popup>
        </Marker>
      ))}
      {data && data.optimal_path && (
        <Polyline
          positions={data.optimal_path.map(point => [point.latitude, point.longitude])}
          color="red"
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
