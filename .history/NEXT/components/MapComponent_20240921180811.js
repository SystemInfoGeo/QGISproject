import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Centre de la carte : coordonnées de Tizi Ouzou
const Point_depart_fixe = [36.7169, 4.0497]; // Coordonnées du centre de Tizi Ouzou
const Point_arrivee_fixe = [36.706130742911107, 4.012404383608166];

// Fonction pour vérifier si une poubelle est pleine ou vide selon sa dernière collecte
const getStatus = (lastCollected) => {
  const currentTime = new Date();
  const collectedTime = new Date(lastCollected);
  
  // Si plus de 3 jours depuis la dernière collecte, considérer la poubelle comme "pleine"
  const timeDiff = Math.abs(currentTime - collectedTime);
  const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  return diffDays > 3 ? 'plein' : 'vide';
};

const MapComponent = ({ points = [], optimalPath = [], collectedBins, setCollectedBins }) => {
  // Transformer les points en objets { latitude, longitude, status }
  const formattedPoints = points
    .filter(point => point.latitude !== undefined && point.longitude !== undefined) // Ne garder que les points valides
    .map(point => ({
      ...point,
      status: getStatus(point.last_collected) // Déterminez le statut en fonction de `last_collected`
    }));

  const handleMarkerClick = async (index) => {
    const binId = formattedPoints[index].id;
    try {
      const response = await fetch(`/api/updateStatus/${binId}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'vide' }) // Exemple de mise à jour
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
    console.log('Points reçus dans MapComponent:', formattedPoints);
  }, [formattedPoints]);

  return (
    <MapContainer center={Point_depart_fixe} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Marqueur du point de départ */}
      <Marker
        position={Point_depart_fixe}
        icon={divIcon({ html: '<div style="background-color: white">Départ</div>' })}
      />

      {/* Marqueurs des points intermédiaires (poubelles) */}
      {formattedPoints.map((point, index) => (
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
        positions={[
          Point_depart_fixe, 
          ...formattedPoints.map(p => [p.latitude, p.longitude]), 
          Point_arrivee_fixe
        ]} 
        color="blue" 
      />
    </MapContainer>
  );
};

export default MapComponent;
