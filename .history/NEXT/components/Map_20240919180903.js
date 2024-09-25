// components/Map.js
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Charger l'icône Leaflet par défaut pour éviter les problèmes de chemin
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';

const Map = ({ setLat, setLng }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = L.map(mapRef.current).setView([36.7169, 4.0497], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const marker = L.marker([36.7169, 4.0497], { draggable: true }).addTo(map);

    // Met à jour les coordonnées lorsque le marqueur est déplacé
    marker.on('dragend', (event) => {
      const { lat, lng } = event.target.getLatLng();
      setLat(lat);
      setLng(lng);
    });

    // Met à jour les coordonnées lorsque la carte est cliquée
    map.on('click', (event) => {
      const { lat, lng } = event.latlng;
      marker.setLatLng([lat, lng]);
      setLat(lat);
      setLng(lng);
    });

    return () => {
      map.remove();
    };
  }, [setLat, setLng]);

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }}></div>;
};

export default Map;
