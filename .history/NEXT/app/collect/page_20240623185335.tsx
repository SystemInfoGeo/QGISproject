'use client';

import { useState, useEffect } from 'react';
import styles from './collect.module.css';

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
      <header className={styles.header}>
        <h1>Chemin de Collecte Optimisé</h1>
      </header>
      <main className={styles.main}>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className={styles.pathContainer}>
            <h2>Itinéraire Optimal</h2>
            <ol className={styles.pathList}>
              {path.map((point, index) => (
                <li key={index} className={styles.pathPoint}>
                  <span>Étape {index + 1}:</span>
                  <span>Latitude: {point.latitude}</span>
                  <span>Longitude: {point.longitude}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
