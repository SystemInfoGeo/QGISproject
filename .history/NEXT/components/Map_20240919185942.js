import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Charger Leaflet uniquement côté client
const Leaflet = dynamic(() => import('leaflet'), { ssr: false });

const Map = ({ onClick }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Charger Leaflet une fois qu'il est disponible
      Leaflet.then((L) => {
        const mapInstance = L.map('map').setView([36.7169, 4.0497], 13);
        setMap(mapInstance);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(mapInstance);

        // Icône par défaut
        const defaultIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });

        // Gérer les clics sur la carte
        let marker = null;
        mapInstance.on('click', function (e) {
          const { lat, lng } = e.latlng;

          // Si un marqueur existe déjà, le déplacer
          if (marker) {
            marker.setLatLng([lat, lng]);
          } else {
            // Créer un nouveau marqueur draggable
            marker = L.marker([lat, lng], { icon: defaultIcon, draggable: true }).addTo(mapInstance);
          }

          if (onClick) {
            onClick({ lat, lng });
          }
        });
      });
    }
  }, [onClick]);

  return <div id="map" style={{ height: '500px', width: '100%' }}></div>;
};

export default Map;
