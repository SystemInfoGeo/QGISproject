'use client';

import { useState, useEffect } from 'react';
import styles from './collect.module.css';
import dynamic from 'next/dynamic';
import { LatLngTuple } from 'leaflet';

const MapComponent = dynamic(() => import('../../components/MapComponent'), {
  ssr: false,
});

interface Point {
  latitude: number;
  longitude: number;
}

interface OptimalPathData {
  points: Point[];
  optimal_path: [number, number][];
}

export default function Collect() {
  const [data, setData] = useState<OptimalPathData | null>(null);
  const [loading, setLoading] = useState(true);
  const []

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
          console.log('Data received:', result); // Log the received data
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
          <div className={styles.map}>
            <MapComponent 
              points={data ? data.points : []} 
              optimalPath={data ? data.optimal_path as LatLngTuple[] : []} 
            />
          </div>
        )}
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
