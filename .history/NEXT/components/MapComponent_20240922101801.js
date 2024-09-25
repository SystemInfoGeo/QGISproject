import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { divIcon } from 'leaflet';
import polyline from '@mapbox/polyline';
import 'leaflet-polylinedecorator';
import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect } from 'react';

// Définir le point de départ et d'arrivée
const Point_depart_fixe = [36.714666886023693, 4.045495309895148]; // Point de départ
const Point_arrivee_fixe = [36.706130742911107, 4.012404383608166]; // Point d'arrivée

const MapComponent = ({
  points = [],
  optimalPath = [],
  itinerairesORS = [],
  onAllCollected,
  resetMap,
  collectedBins,
  setCollectedBins
}) => {
  const center = [36.712776, 4.040093];
  const [collectedPoints, setCollectedPoints] = useState(Array(optimalPath.length).fill(false));
  const [allCollected, setAllCollected] = useState(false); // Suivi de la collecte complète
  const [showCongratsMessage, setShowCongratsMessage] = useState(false); // Affichage du message de félicitations

  useEffect(() => {
    const initialCollectedPoints = Array(optimalPath.length).fill(false);
    setCollectedPoints(initialCollectedPoints);
  }, [optimalPath]);

  // Surveillance des points collectés et mise à jour de l'état `allCollected`
  useEffect(() => {
    console.log('Collected points:', collectedPoints); // Ajout pour diagnostic
    const allCollectedNow = collectedPoints.slice(1, -1).every(point => point === true);
    console.log('Tous les points collectés ?', allCollectedNow); // Ajout pour diagnostic
    setAllCollected(allCollectedNow);
    if (onAllCollected) {
      onAllCollected(allCollectedNow);
    }
  }, [collectedPoints, onAllCollected]);

  useEffect(() => {
    if (resetMap) {
      setCollectedPoints(Array(points.length).fill(false));
      setAllCollected(false);
      setShowCongratsMessage(false); // Réinitialise le message
    }
  }, [resetMap, points.length]);

  const handleMarkerClick = (index) => {
    // Vérifier que le point précédent est déjà vert (collecté)
    if (index > 1 && !collectedPoints[index - 1]) {
      return;
    }

    // Mettre à jour l'état pour marquer ce point comme collecté (vert)
    setCollectedPoints(prevCollectedPoints => {
      const updatedCollectedPoints = [...prevCollectedPoints];
      updatedCollectedPoints[index] = true;  // Marquer ce point comme collecté (vert)
      return updatedCollectedPoints;
    });
  };

  const handleFinish = () => {
    if (allCollected) {
      setShowCongratsMessage(true); // Afficher le message de félicitations si tout est collecté
    }
  };

  const createIcon = (number, color = 'red') => {
    const size = 20;
    return divIcon({
      html: `<div style="background-color: ${color}; color: black; border-radius: 50%; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">${number}</div>`,
      className: ''
    });
  };

  const decodedPolylines = itinerairesORS.map(itineraire => {
    if (itineraire.routes && itineraire.routes.length > 0 && itineraire.routes[0].geometry) {
      return polyline.decode(itineraire.routes[0].geometry).map(coord => [coord[0], coord[1]]);
    }
    return [];
  });

  return (
    <>
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* Point de départ (non cliquable) */}
        <Marker position={Point_depart_fixe} icon={createIcon(0, 'white')} />

        {/* Points intermédiaires */}
        {optimalPath.slice(1, -1).map((coord, index) => {
          const isCollected = collectedPoints[index];
          const color = isCollected ? 'green' : 'red';

          return (
            <Marker
              key={index}
              position={coord}
              icon={createIcon(index + 1, color)}
              eventHandlers={{
                click: () => handleMarkerClick(index)
              }}
            />
          );
        })}

        {/* Point d'arrivée (non cliquable) */}
        <Marker position={Point_arrivee_fixe} icon={createIcon(optimalPath.length, 'black')} />

        {/* Polylignes entre les points */}
        {optimalPath.length > 1 && <Polyline positions={optimalPath} color="blue" />}

        {/* Décoder et afficher les polylignes supplémentaires */}
        {decodedPolylines.map((poly, index) => (
          <Polyline key={index} positions={poly} color="red" />
        ))}
      </MapContainer>

      {/* Bouton "Terminer" et message de félicitations */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={handleFinish}
          disabled={!allCollected}  // Désactive le bouton si tous les points ne sont pas verts
          style={{
            padding: '10px 20px',
            backgroundColor: allCollected ? '#4caf50' : '#9e9e9e',  // Change la couleur selon l'état
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: allCollected ? 'pointer' : 'not-allowed'
          }}
        >
          Terminer
        </button>

        {/* Affichage du message de félicitations */}
        {showCongratsMessage && (
          <div style={{ marginTop: '20px', fontSize: '20px', color: 'green' }}>
            Bravo ! La collecte est terminée.
          </div>
        )}
      </div>
    </>
  );
};

export default MapComponent;
