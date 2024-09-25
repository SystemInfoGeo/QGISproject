import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css'; // Styles des marqueurs supplémentaires
import extraMarkers from 'leaflet-extra-markers'; // Bibliothèque des marqueurs
import 'leaflet-extra-markers';

const Map = ({ onClick }) => {
  useEffect(() => {
    // Configurer un marqueur bleu depuis leaflet-extra-markers
    const blueIcon = extraMarkers.icon({
      icon: 'fa-number',
      markerColor: 'blue', // Couleur du marqueur (bleu)
      shape: 'circle',
      prefix: 'fa', // Utilisation de Font Awesome (peut être ignoré si non nécessaire)
      iconColor: '#FFFFFF',
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
