/*import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Point {
  latitude: number;
  longitude: number;
}

interface OptimalPathData {
  points: Point[];
  optimal_path: Point[];
}

interface MapProps {
  data: OptimalPathData | null;
}

const MapComponent: React.FC<MapProps> = ({ data }) => {
  const center: [number, number] = [36.712776, 4.040093]; // Coordonnées du centre de la carte
  const [allPoints, setAllPoints] = useState<Point[]>([]);

  useEffect(() => {
    if (data) {
      setAllPoints(data.points);
    }
  }, [data]);

  return (
    <MapContainer center={center} zoom={10} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {allPoints.map((point, index) => (
        <Marker key={index} position={[point.latitude, point.longitude]}>
          <Popup>
            Point {index + 1}: ({point.latitude}, {point.longitude})
          </Popup>
        </Marker>
      ))}
      {data && data.optimal_path && (
        <Polyline
          positions={data.optimal_path.map(point => [point.latitude, point.longitude])}
          color="red"
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;*/


/*

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
        <Marker key={index} position={[point.latitude, point.longitude] as LatLngTuple}>
          <Popup>
            Point {index + 1}: ({point.latitude}, {point.longitude})
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
