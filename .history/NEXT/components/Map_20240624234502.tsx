'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import styles from './Map.module.css';
import { LatLngTuple } from 'leaflet';

// Utilisation de dynamic import pour charger le composant uniquement côté client
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });

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
