/*'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';
import styles from './collect.module.css';

interface Point {
  latitude: number;
  longitude: number;
}

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 36.714666886023693,
  lng: 4.045495309895148
};

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
          <div className={styles.loader}>Chargement...</div>
        ) : (
          <div className={styles.content}>
            <div className={styles.map}>
              <LoadScript googleMapsApiKey="AIzaSyAuaWWRhC6WadKtNg96EacPsrkifAc2Lhk">
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
                  <Polyline
                    path={path.map(point => ({ lat: point.latitude, lng: point.longitude }))}
                    options={{ strokeColor: '#FF0000', strokeOpacity: 1, strokeWeight: 2 }}
                  />
                </GoogleMap>
              </LoadScript>
            </div>
            <div className={styles.tableContainer}>
              <h2>Chemin Optimal à suivre :</h2>
              <table>
                <thead>
                  <tr>
                    <th>Point</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                  </tr>
                </thead>
                <tbody>
                  {path.map((point, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{point.latitude}</td>
                      <td>{point.longitude}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';
import styles from './collect.module.css';

interface Point {
  latitude: number;
  longitude: number;
}

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 36.714666886023693,
  lng: 4.045495309895148
};

export default function Collect() {
  const [path, setPath] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPath = async () => {
      try {
        const response = await fetch('/api/updateStatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            points: [
              { latitude: 36.67798, longitude: 4.05681 },
              // Ajoutez plus de points ici si nécessaire
            ],
          }),
        });
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
          <div className={styles.loader}>Chargement...</div>
        ) : (
          <div className={styles.content}>
            <div className={styles.map}>
              <LoadScript googleMapsApiKey="AIzaSyAuaWWRhC6WadKtNg96EacPsrkifAc2Lhk">
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
                  <Polyline
                    path={path.map(point => ({ lat: point.latitude, lng: point.longitude }))}
                    options={{ strokeColor: '#FF0000', strokeOpacity: 1, strokeWeight: 2 }}
                  />
                </GoogleMap>
              </LoadScript>
            </div>
            <div className={styles.tableContainer}>
              <h2>Itinéraire Optimal</h2>
              <table>
                <thead>
                  <tr>
                    <th>Étape</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                  </tr>
                </thead>
                <tbody>
                  {path.map((point, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{point.latitude}</td>
                      <td>{point.longitude}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

