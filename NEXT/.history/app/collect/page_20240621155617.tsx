'use client';

import { useState, useEffect } from 'react';
import styles from './collect.module.css';

// Définir une interface pour le type des points
interface Point {
  latitude: number;
  longitude: number;
}

export default function Collect() {
  const [path, setPath] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPath = async () => {
      try {
        const response = await fetch('/api/updateStatus');
        const data = await response.json();
        setPath(data.optimal_path);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setLoading(false);
      }
    };

    fetchPath();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Affichage du Court Chemin</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ul className>
          {path.map((point, index) => (
            <li key={index}>
              Latitude: {point.latitude}, Longitude: {point.longitude}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
