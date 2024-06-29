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
}*/






// pages/collect/index.tsx

'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import styles from './collect.module.css';

// Dynamically import the MapContainer and other Leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface Point {
  latitude: number;
  longitude: number;
}

interface OptimalPathData {
  optimal_path: Point[];
}

export default function Collect() {
  const [data, setData] = useState<OptimalPathData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPath = async () => {
      try {
        const response = await fetch('/api/updateStatus', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const result = await response.json();
          console.log('Fetched data:', result);  // Log fetched data
          if (result && result.optimal_path && result.optimal_path.length > 0) {
            setData(result);
            console.log('Data set:', result);
          } else {
            console.error('Invalid data received:', result);
          }
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Chemin de Collecte Optimisé</h1>
        </header>
        <main className={styles.main}>
          <div className={styles.loader}>Chargement...</div>
        </main>
        <footer className={styles.footer}>
          <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
        </footer>
      </div>
    );
  }

  if (!data || !data.optimal_path || data.optimal_path.length === 0) {
    console.log('No data or invalid data:', data);  // Log invalid or no data
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Chemin de Collecte Optimisé</h1>
        </header>
        <main className={styles.main}>
          <div className={styles.noData}>Aucune donnée reçue</div>
        </main>
        <footer className={styles.footer}>
          <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Chemin de Collecte Optimisé</h1>
      </header>
      <main className={styles.main}>
        <MapContainer
          center={[data.optimal_path[0].latitude, data.optimal_path[0].longitude]}
          zoom={13}
          className={styles.map}
          style={{ height: "600px", width: "100%" }} // Inline styles for the map
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {data.optimal_path.map((point, index) => (
            <Marker key={index} position={[point.latitude, point.longitude]}>
              <Popup>
                Point {index + 1}: [{point.latitude}, {point.longitude}]
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
