import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';

const Point_depart_fixe = [36.714666886023693, 4.045495309895148];
const Point_arrivee_fixe = [36.706130742911107, 4.012404383608166];

const MapComponent = ({ points = [], optimalPath = [], collectedBins, setCollectedBins }) => {
  const handleMarkerClick = async (index) => {
    const binId = points[index].id;
    const response = await fetch(`/api/updateStatus/${binId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'vide' })
    });
    if (response.ok) {
      setCollectedBins([...collectedBins, binId]);
    }
  };

  return (
    <MapContainer center={Point_depart_fixe} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {points.map((point, index) => (
        <Marker
          key={index}
          position={[point.latitude, point.longitude]}
          icon={divIcon({ html: `<div style="background-color: ${point.status === 'plein' ? 'red' : 'green'}">${index + 1}</div>` })}
          eventHandlers={{ click: () => handleMarkerClick(index) }}
        />
      ))}
      <Polyline positions={[Point_depart_fixe, ...points.map(p => [p.latitude, p.longitude]), Point_arrivee_fixe]} color="blue" />
    </MapContainer>
  );
};

export default MapComponent;
