// pages/collect/index.tsx

'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import styles from './collect.module.css';
import 'leaflet/dist/leaflet.css';

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
          setData(result);
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

  const createPolyline = (path: Point[]) => {
    return path.map(point => [point.latitude, point.longitude]);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Chemin de Collecte Optimisé</h1>
      </header>
      <main className={styles.main}>
        {loading ? (
          <div className={styles.loader}>Chargement...</div>
        ) : data && data.optimal_path.length > 0 ? (
          <MapContainer
            center={[data.optimal_path[0].latitude, data.optimal_path[0].longitude]}
            zoom={13}
            className={styles.map}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polyline positions={createPolyline(data.optimal_path)} color="blue" />
            {data.optimal_path.map((point, index) => (
              <Marker key={index} position={[point.latitude, point.longitude]}>
                <Popup>
                  Point {index + 1}: [{point.latitude}, {point.longitude}]
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className={styles.noData}>Aucune donnée reçue</div>
        )}
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
