import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'font-awesome/css/font-awesome.min.css'; // Assurez-vous que Font Awesome est importé

const Map = ({ onClick }) => {
  useEffect(() => {
    // Configurer un marqueur bleu avec Font Awesome
    const blueIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/svgs/solid/number.svg', // URL pour l'icône Font Awesome
      iconSize: [32, 32], // Taille de l'icône
      iconAnchor: [16, 32], // Point d'ancrage de l'icône
      popupAnchor: [0, -32], // Point d'ancrage pour les popups
      className: 'leaflet-div-icon' // Utiliser une classe CSS pour appliquer le style
    });

    // Centrer la carte sur Tizi Ouzou
    const map = L.map('map').setView([36.7169, 4.0497], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    let marker = null;

    // Lorsque l'utilisateur clique sur la carte
    map.on('click', function (e) {
      const { lat, lng } = e.latlng;

      // Si un marqueur existe déjà, on le déplace
      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        // Sinon, on crée un nouveau marqueur bleu
        marker = L.marker([lat, lng], { icon: blueIcon }).addTo(map);
      }

      // Appelle la fonction `onClick` pour remplir les champs de longitude et latitude
      if (onClick) {
        onClick({ lat, lng });
      }
    });

    // Cleanup de la carte à la fin
    return () => {
      map.remove();
    };
  }, [onClick]);

  return (
    <div id="map" style={{ height: '400px', width: '100%' }}>
      {/* Carte affichée ici */}
    </div>
  );
};

export default Map;
