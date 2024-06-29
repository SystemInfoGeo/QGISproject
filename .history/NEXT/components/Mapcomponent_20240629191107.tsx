/*////////////////// ce code affiche ces points sur la map 
import React from 'react';
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









/* ce code  N°2 affiche bien les points et le chemin entre ces points mais le soucis est que il montre pas au quel point il va aller en premier */
/*import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Point {
  latitude: number;
  longitude: number;
}

interface MapProps {
  points: Point[];
  optimalPath: LatLngTuple[];
}

const MapComponent: React.FC<MapProps> = ({ points, optimalPath }) => {
  const center: LatLngTuple = [36.712776, 4.040093]; // Coordonnées du centre de la carte

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
          radius={5}
          fillColor="red"
          color="red"
          weight={1}
          opacity={1}
          fillOpacity={0.6}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
            <span>Point {index + 1}</span>
          </Tooltip>
        </CircleMarker>
      ))}
      {optimalPath.length > 0 && (
        <Polyline
          positions={optimalPath}
          color="blue"
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
*/










import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Polyline } from 'react-leaflet';
import { LatLngTuple, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Point {
  latitude: number;
  longitude: number;
}

interface MapProps {
  points: Point[];
  optimalPath: LatLngTuple[];
}

const MapComponent: React.FC<MapProps> = ({ points, optimalPath }) => {
  const center: LatLngTuple = [36.712776, 4.040093]; // Coordonnées du centre de la carte

  // Function to create a custom icon with a number
  const createIcon = (number: number) => {
    return divIcon({
      html: `<div style="background-color: blue; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">${number}</div>`,
      className: ''
    });
  };

  return (
    <MapContainer center={center} zoom={10} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {points.map((point, index) => (
        <Marker
          key={index}
          position={[point.latitude, point.longitude] as LatLngTuple}
        >*/
          <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
            <span>Point {index + 1}</span>
          </Tooltip>
        </Marker>
      ))}
      {optimalPath.map((coord, index) => (
        <Marker
          key={`optimal-${index}`}
          position={coord as LatLngTuple}
          icon={createIcon(index + 1)} // Add the number to the marker
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
            <span>{index + 1}</span>
          </Tooltip>
        </Marker>
      ))}
      {optimalPath.length > 0 && (
        <Polyline
          positions={optimalPath}
          color="red"
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
