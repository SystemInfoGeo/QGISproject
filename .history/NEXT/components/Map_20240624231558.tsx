'use client';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Map.module.css';

interface MapProps {
  path: number[][];
}

const Map: React.FC<MapProps> = ({ path }) => {
  const center = path.length > 0 ? [path[0][0], path[0][1]] : [0, 0];

  return (
    <MapContainer center={center} zoom={13} className={styles.map}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polyline positions={path} color="blue" />
    </MapContainer>
  );
};

export default Map;
