import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ onClick }) => {
  useEffect(() => {
    // Centrer la carte sur Tizi Ouzou (coordonnées: 36.7169, 4.0497)
    const map = L.map('map').setView([36.7169, 4.0497], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    let marker;

    // Lorsque l'utilisateur clique sur la carte
    map.on('click', function (e) {
      const { lat, lng } = e.latlng;

      // Si un marqueur existe déjà, on le déplace
      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        // Sinon, on crée un nouveau marqueur
        marker = L.marker(e.latlng).addTo(map);
      }

      // Appelle la fonction `onClick` pour remplir les champs de longitude et latitude
      if (onClick) {
        onClick({ lat, lng });
      }
    });
  }, [onClick]);

  return (
    <div id="map" style={{ height: '400px', width: '100%' }}>
      {/* Carte affichée ici */}
    </div>
  );
};

export default Map;
