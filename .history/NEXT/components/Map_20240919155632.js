import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importer les icônes de Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const Map = ({ onClick }) => {
  useEffect(() => {
    // Configurer les icônes par défaut de Leaflet
    const defaultIcon = L.icon({
      iconUrl: iconUrl,
      iconRetinaUrl: iconRetinaUrl,
      shadowUrl: shadowUrl,
      iconSize: [25, 41], // Taille de l'icône
      iconAnchor: [12, 41], // Point d'ancrage de l'icône
      popupAnchor: [1, -34], // Point d'ancrage des popups
      shadowSize: [41, 41] // Taille de l'ombre
    });

    L.Marker.prototype.options.icon = defaultIcon;

    // Centrer la carte sur Tizi Ouzou
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
