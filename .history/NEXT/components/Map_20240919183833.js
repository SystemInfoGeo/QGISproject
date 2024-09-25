// components/Map.js
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ onClick }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialiser la carte centrée sur Tizi Ouzou
      const map = L.map('map').setView([36.7169, 4.0497], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Icône par défaut de Leaflet
      const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      // Variable pour stocker le marqueur
      let marker = null;

      // Lorsque l'utilisateur clique sur la carte
      map.on('click', function (e) {
        const { lat, lng } = e.latlng;

        // Si un marqueur existe déjà, le déplacer ou le mettre à jour
        if (marker) {
          marker.setLatLng(e.latlng);
        } else {
          // Créer un nouveau marqueur draggable avec l'icône par défaut
          marker = L.marker(e.latlng, { icon: defaultIcon, draggable: true }).addTo(map);
        }

        // Appelle la fonction `onClick` pour mettre à jour les coordonnées
        if (onClick) {
          onClick(e.latlng);
        }
      });
    }
  }, [onClick]);

  return <div id="map" style={{ height: '500px', width: '100%' }}></div>;
};

export default Map;
