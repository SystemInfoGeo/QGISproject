import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ onClick }) => {
  useEffect(() => {
    // Configurer une icône personnalisée avec l'icône par défaut de Leaflet
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', // Icône par défaut de Leaflet
      iconSize: [25, 41], // Taille de l'icône par défaut
      iconAnchor: [12, 41], // Point d'ancrage de l'icône par défaut
      popupAnchor: [1, -34], // Point d'ancrage pour les popups
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

      // Si un marqueur existe déjà, le déplacer
      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        // Sinon, créer un nouveau marqueur draggable avec l'icône par défaut
        marker = L.marker([lat, lng], {
          icon: defaultIcon,
          draggable: true // Marqueur draggable
        }).addTo(map);

        // Écouter les événements de déplacement du marqueur
        marker.on('move', function (e) {
          const { lat, lng } = e.latlng;
          if (onClick) {
            onClick({ lat, lng });
          }
        });
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
