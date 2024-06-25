'use client';

import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Map.module.css';
import { LatLngTuple } from 'leaflet';

interface MapProps {
  path: LatLngTuple[];
}

const Map: React.FC<MapProps> = ({ path }) => {
  const center: LatLngTuple = path.length > 0 ? [path[0][0], path[0][1]] : [36.71566, 4.07022]; // Default center if path is empty

  return (
    <MapContainer center={center} zoom={13} className={styles.map}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polyline positions={path as LatLngTuple[]} pathOptions={{ color: 'blue' }} />
    </MapContainer>
  );
};

export default Map;
