/*'use client';

import { useState, useEffect } from 'react';
import styles from './collect.module.css';

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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Chemin de Collecte Optimisé</h1>
      </header>
      <main className={styles.main}>
        {loading ? (
          <div className={styles.loader}>Chargement...</div>
        ) : (
          <pre className={styles.content}>
            {data ? JSON.stringify(data, null, 2) : 'Aucune donnée reçue'}
          </pre>
        )}
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

*/


'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import L from 'leaflet';
import styles from './collect.module.css';

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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Chemin de Collecte Optimisé</h1>
      </header>
      <main className={styles.main}>
        {loading ? (
          <div className={styles.loader}>Chargement...</div>
        ) : (
          <div className={styles.mapContainer}>
            <MapContainer center={[36.714666886023693, 4.045495309895148]} zoom={13} className={styles.map}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {data && (
                <Polyline
                  positions={data.optimal_path.map(point => [point.latitude, point.longitude])}
                  color="blue"
                />
              )}
            </MapContainer>
          </div>
        )}
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
      </footer>
    </div>
  );
}


