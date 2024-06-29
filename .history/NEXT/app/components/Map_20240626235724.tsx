// components/Map.tsx
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngTuple, LatLngBounds, Icon } from 'leaflet';

// Définir une icône rouge personnalisée
const redIcon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  className: 'leaflet-red-icon'
});

interface Point {
  latitude: number;
  longitude: number;
}

interface OptimalPathData {
  optimal_path: Point[];
}

interface MapProps {
  data: OptimalPathData | null;
}

const Map = ({ data }: MapProps) => {
  const position: LatLngTuple = [36.7169, 4.0495]; // Coordonnées centrales de Tizi Ouzou
  const zoomLevel = 12; // Ajustez le niveau de zoom pour cadrer la région de Tizi Ouzou

  // Définir les limites de la carte pour la région de Tizi Ouzou
  const bounds: LatLngBounds = new LatLngBounds(
    [36.6, 3.9], // Sud-Ouest
    [36.8, 4.2]  // Nord-Est
  );

  return (
    <MapContainer 
      center={position} 
      zoom={zoomLevel} 
      scrollWheelZoom={false} 
      style={{ height: '100vh', width: '100%' }}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data && data.optimal_path.map((point, index) => {
        const markerPosition: LatLngTuple = [point.latitude, point.longitude];
        return (
          <Marker key={index} position={markerPosition} icon={redIcon}>
            <Popup>
              Point {index + 1}
            </Popup>
          </Marker>
        );
      })}
      {data && (
        <Polyline 
          positions={data.optimal_path.map(point => [point.latitude, point.longitude] as LatLngTuple)}
          color="blue" 
        />
      )}
    </MapContainer>
  );
};

export default Map;