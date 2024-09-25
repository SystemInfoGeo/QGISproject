import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction de l'icône par défaut pour réagir à un problème dans React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationMarker = ({ setPosition }) => {
  const [position, setMarkerPosition] = useState(null);

  // Gestion des événements de la carte pour capturer les clics
  useMapEvents({
    click(e) {
      setMarkerPosition(e.latlng);
      setPosition(e.latlng);  // Met à jour les coordonnées du formulaire
    },
  });

  return position === null ? null : (
    <Marker position={position}>
    </Marker>
  );
};

const Map = ({ onClick }) => {
  const [position, setPosition] = useState(null);

  return (
    <MapContainer
      center={[36.7169, 4.0497]} // Centrer sur Tizi Ouzou
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker setPosition={(latlng) => {
        setPosition(latlng);
        if (onClick) {
          onClick(latlng);  // Met à jour la position dans le formulaire
        }
      }} />
    </MapContainer>
  );
};

export default Map;
