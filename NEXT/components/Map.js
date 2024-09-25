import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

// Importation normale de Leaflet
let L;
if (typeof window !== 'undefined') {
  L = require('leaflet'); // Charger Leaflet uniquement côté client
}

const Map = ({ onClick }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (L && !map) {
      // Initialiser la carte centrée sur Tizi Ouzou
      const mapInstance = L.map('map').setView([36.7169, 4.0497], 13);
      setMap(mapInstance);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstance);

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
      mapInstance.on('click', function (e) {
        const { lat, lng } = e.latlng;

        // Si un marqueur existe déjà, le déplacer ou le mettre à jour
        if (marker) {
          marker.setLatLng(e.latlng);
        } else {
          // Sinon, créer un nouveau marqueur draggable avec l'icône par défaut
          marker = L.marker(e.latlng, {
            icon: defaultIcon,
            draggable: true,
          }).addTo(mapInstance);
        }

        // Appelle la fonction `onClick` pour remplir les champs de longitude et latitude
        if (onClick) {
          onClick({ lat, lng });
        }
      });
    }
  }, [map, onClick]);

  return <div id="map" style={{ height: '500px', width: '100%' }}></div>;
};

export default Map;
