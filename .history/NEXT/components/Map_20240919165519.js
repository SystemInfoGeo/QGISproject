import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Chemin vers votre icône locale
const iconUrl = '/images/mark.png'; // Chemin correct vers l'image

const Map = ({ onClick }) => {
  useEffect(() => {
    // Configurer une icône personnalisée avec l'image locale
    const customIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [32, 32], // Taille de l'icône (ajustez selon vos besoins)
      iconAnchor: [16, 32], // Point d'ancrage de l'icône (ajustez selon vos besoins)
      popupAnchor: [0, -32], // Point d'ancrage pour les popups (ajustez selon vos besoins)
    });

    // Initialiser la carte centrée sur Tizi Ouzou
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
        marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      }

      // Appelle la fonction `onClick` pour remplir les champs de longitude et latitude
      if (onClick) {
        onClick({ lat, lng });
      }
    });

    // Nettoyer la carte à la fin
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
