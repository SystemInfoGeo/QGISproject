'use client';

import { useState, useEffect } from 'react';
import styles from './collect.module.css';

export default function Collect() {
  const [path, setPath] = useState([]);
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
      <h1>Affichage du Court Chemin</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ul>
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
