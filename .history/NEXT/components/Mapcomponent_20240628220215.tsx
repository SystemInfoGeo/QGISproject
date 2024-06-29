/*import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Point {
  latitude: number;
  longitude: number;
}

const points: Point[] = [
  { latitude: 36.71566, longitude: 4.07022 },
  { latitude: 36.676964118549975, longitude: 4.205593732329381 },
  { latitude: 36.67798, longitude: 4.05681 },
  { latitude: 36.61242246992321, longitude: 3.769298600705095 },
  { latitude: 36.62291410499312, longitude: 4.07498028219292 },
  { latitude: 36.580119761851364, longitude: 3.752456155821376 },
  { latitude: 36.86212232688119, longitude: 3.980764852194384 }
];

const center: LatLngTuple = [36.712776, 4.040093]; // Coordonnées du centre de la carte

const MapComponent = () => {
  return (
    <MapContainer center={center} zoom={10} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {points.map((point, index) => (
        <CircleMarker
          key={index}
          center={[point.latitude, point.longitude] as LatLngTuple}
          radius={3}
          fillColor="red"
          color="red"
          weight={5}
          opacity={1}
          fillOpacity={0.6}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
            <span>Point {index + 1}</span>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
*/


