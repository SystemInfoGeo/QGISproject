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
*/

















// pages/collect/index.tsx
/*
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import styles from './collect.module.css';
import axios from 'axios';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });

export default function Collect() {
  const [optimalPathData, setOptimalPathData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/updateStatus');
        const data = response.data;
        setOptimalPathData(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log('Optimal path data received:', optimalPathData);
  }, [optimalPathData]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Carte Leaflet</h1>
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
          {optimalPathData && (
            <>
              <Marker position={optimalPathData.points[0]}>
                <Popup>
                  Point de départ
                </Popup>
              </Marker>
              <Polyline pathOptions={{ color: 'red' }} positions={optimalPathData.optimal_path} />
            </>
          )}
        </MapContainer>
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Gestion des Déchets. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
*/











/*
import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Point {
  latitude: number;
  longitude: number;
}

interface OptimalPathData {
  optimal_path: Point[];
}

interface MapProps {
  data: OptimalPathData | null;
}

const MapComponent: React.FC<MapProps> = ({ data }) => {
  const center: [number, number] = [36.712776, 4.040093]; // Coordonnées du centre de la carte

  return (
    <MapContainer center={center} zoom={10} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {data && data.optimal_path.map((point, index) => (
        <Marker key={index} position={[point.latitude, point.longitude]}>
          <Popup>
            Point {index + 1}: ({point.latitude}, {point.longitude})
          </Popup>
        </Marker>
      ))}
      {data && (
        <Polyline
          positions={data.optimal_path.map(point => [point.latitude, point.longitude])}
          color="red"
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
