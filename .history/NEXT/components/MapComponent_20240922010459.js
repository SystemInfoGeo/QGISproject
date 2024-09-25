import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
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
  binIds = [],
  onAllCollected,
  resetMap,
  collectedBins,
  setCollectedBins
}) => {
  const center = [36.712776, 4.040093];
  const [collectedPoints, setCollectedPoints] = useState(Array(optimalPath.length).fill(false));
  const [errorMessage, setErrorMessage] = useState('');  // Nouvelle variable pour stocker le message d'erreur

  useEffect(() => {
    const initialCollectedPoints = Array(optimalPath.length).fill(false);
    setCollectedPoints(initialCollectedPoints);
  }, [optimalPath]);

  useEffect(() => {
    const allCollected = collectedPoints.slice(1, -1).every(point => point === true);
    onAllCollected(allCollected);
  }, [collectedPoints, onAllCollected]);

  useEffect(() => {
    if (resetMap) {
      setCollectedPoints(Array(points.length).fill(false));
    }
  }, [resetMap, points.length]);

  const handleMarkerClick = async (index) => {
    // Vérifier que le point précédent est déjà vert (collecté)
    if (index > 1 && !collectedPoints[index - 1]) {
      setErrorMessage(`Vous devez d'abord collecter le point précédent avant de cliquer sur celui-ci.`);
      return;
    }

    // Vérifiez si binIds existe et contient un ID pour ce point
    if (!binIds || !binIds[index]) {
      console.error(`ID de la poubelle introuvable pour ce point avec l'index ${index}`);
      setErrorMessage(`ID de la poubelle introuvable pour ce point avec l'index ${index}`);
      return;
    }

    // Récupérer l'ID de la poubelle
    const binId = binIds[index];

    try {
      // Effectuer une requête pour mettre à jour le statut de la poubelle
      const response = await fetch(`http://localhost:5000/update-trash-bin-status/${binId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'vide'  // Mettre à jour le statut à 'vide'
        }),
      });

      if (response.ok) {
        console.log(`Statut de la poubelle ${binId} mis à jour avec succès`);
        const updatedCollectedPoints = [...collectedPoints];
        updatedCollectedPoints[index] = true;  // Marquer ce point comme collecté (vert)
        setCollectedPoints(updatedCollectedPoints);  // Mettre à jour l'état des points collectés
        setErrorMessage('');  // Réinitialiser le message d'erreur si tout va bien
      } else {
        console.error('Erreur lors de la mise à jour du statut :', response.statusText);
        setErrorMessage(`Erreur lors de la mise à jour du statut : ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut :', error);
      setErrorMessage('Erreur lors de la mise à jour du statut.');
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
      {/* Ajout de la section d'affichage du message d'erreur */}
      {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}

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
    </>
  );
};

export default MapComponent;
