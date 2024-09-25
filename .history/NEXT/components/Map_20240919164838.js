import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Assurez-vous que votre image SVG est dans le dossier public/icons
const iconUrl = '/icons/blue-icon.svg'; // Chemin relatif vers votre icône

const Map = ({ onClick }) => {
  useEffect(() => {
    // Configurer une icône personnalisée
    const blueIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [32, 32], // Taille de l'icône
      iconAnchor: [16, 32], // Point d'ancrage de l'icône
      popupAnchor: [0, -32], // Point d'ancrage pour les popups
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
        // Sinon, on crée un nouveau marqueur avec l'icône personnalisée
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
