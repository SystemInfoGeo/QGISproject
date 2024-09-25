import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

const Point_depart_fixe = [36.714666886023693, 4.045495309895148];
const Point_arrivee_fixe = [36.706130742911107, 4.012404383608166];

const MapComponent = ({ points = [], optimalPath = [], collectedBins, setCollectedBins }) => {
  
  const handleMarkerClick = async (index) => {
    const binId = points[index].id;
    try {
      const response = await fetch(`/api/updateStatus/${binId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'vide' })
      });
      if (response.ok) {
        setCollectedBins([...collectedBins, binId]);
      } else {
        console.error(`Erreur lors de la mise à jour de la poubelle avec l'ID ${binId}`);
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la poubelle: ${error}`);
    }
  };

  useEffect(() => {
    console.log('Points reçus dans MapComponent:', points);
  }, [points]);

  return (
    <MapContainer center={Point_depart_fixe} zoom={13} style={{ height: '800px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Marqueur du point de départ */}
      <Marker
        position={Point_depart_fixe}
        icon={divIcon({ html: '<div style="background-color: white">Départ</div>' })}
      />

      {/* Marqueurs des points */}
      {points.filter(point => point.latitude && point.longitude).map((point, index) => (
        <Marker
          key={index}
          position={[point.latitude, point.longitude]}
          icon={divIcon({
            html: `<div style="background-color: ${point.status === 'plein' ? 'red' : 'green'}; padding: 5px; border-radius: 50%">${index + 1}</div>`
          })}
          eventHandlers={{ click: () => handleMarkerClick(index) }}
        />
      ))}

      {/* Marqueur du point d'arrivée */}
      <Marker
        position={Point_arrivee_fixe}
        icon={divIcon({ html: '<div style="background-color: black; color: white">Arrivée</div>' })}
      />

      {/* Tracé de la polyline entre les points */}
      <Polyline
        positions={[Point_depart_fixe, ...points.filter(p => p.latitude && p.longitude).map(p => [p.latitude, p.longitude]), Point_arrivee_fixe]}
        color="blue"
      />
    </MapContainer>
  );
};

export default MapComponent;
