// pages/collect/index.tsx
/*
'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import styles from './collect.module.css';

// Dynamically import the MapContainer and other Leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function Collect() {
  useEffect(() => {
    console.log('Component loaded');
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Carte Leaflet</h1>
      </header>
      <main className={styles.main}>
        <MapContainer
          center={[36.714666886023693, 4.045495309895148]} // Default center coordinates
          zoom={13}
          className={styles.map}
          style={{ height: "600px", width: "100%" }} // Inline styles for the map
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[36.714666886023693, 4.045495309895148]}>
            <Popup>
              Point de départ
            </Popup>
          </Marker>
        </MapContainer>
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
      </footer>
    </div>
  );
}






// pages/collect/index.tsx

'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import styles from './collect.module.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function Collect() {
  useEffect(() => {
    console.log('Component loaded');
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>le chemin optimal pour la collecte est le suivant :</h1>
      </header>
      <main className={styles.main}>
        <MapContainer
          center={[36.714666886023693, 4.045495309895148]} 
          zoom={13}
          className={styles.map}
          style={{ height: "600px", width: "100%" }} 
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[36.714666886023693, 4.045495309895148]}>
            <Popup>
              Point de départ
            </Popup>
          </Marker>
        </MapContainer>
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
