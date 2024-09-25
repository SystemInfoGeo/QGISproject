import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { LatLngTuple, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from '@mapbox/polyline'; // Pour décoder les polylignes encodées
import 'leaflet-polylinedecorator'; // Pour ajouter des flèches aux polylignes
import 'leaflet/dist/leaflet.css';
import { Circles } from 'react-loader-spinner';
import React, { useState, useEffect } from 'react';

interface Point {
  latitude: number;
  longitude: number;
}

interface ItinerairesORS {
  routes: { geometry: string }[]; // Structure d'un itinéraire venant d'ORS (OpenRouteService)
}

interface MapProps {
  points?: Point[];
  optimalPath?: LatLngTuple[];
  itinerairesORS?: ItinerairesORS[];
  binIds?: number[];// tableau des IDs des poubelles
  onAllCollected: (collected: boolean) => void;
  resetMap: boolean;
  filteredPoints: Point[];
}

const MapComponent: React.FC<MapProps> = ({
  points = [],
  optimalPath = [],
  itinerairesORS = [],
  binIds = [], // Les IDs des poubelles
  onAllCollected,
  resetMap,
  filteredPoints = [],
}) => {
  const center: LatLngTuple = [36.712776, 4.040093]; // Coordonnées centrales de la carte
  const [collectedPoints, setCollectedPoints] = useState<boolean[]>(Array(points.length).fill(false));

   
  /* // Afficher l'état initial de collectedPoints
  useEffect(() => {
    const initialCollectedPoints = Array(points.length).fill(false); // Initialisation de collectedPoints
    setCollectedPoints(initialCollectedPoints);
    console.log('Initialisation de collectedPoints:', initialCollectedPoints);
}, [points]); */


// Utiliser les points rouges (pleins) filtrés pour l'initialisation
useEffect(() => {
  const initialCollectedPoints = Array(filteredPoints.length).fill(false); // Initialisation de collectedPoints avec les points rouges
  setCollectedPoints(initialCollectedPoints);
  console.log('Initialisation de collectedPoints pour les points rouges:', initialCollectedPoints);
}, [filteredPoints]);

// Vérifier les points rouges collectés
useEffect(() => {
  const allCollected = collectedPoints.every(point => point === true);
  console.log('État actuel des points rouges collectés:', collectedPoints);
  console.log('Tous les points rouges pleins collectés :', allCollected);

  // Activer ou désactiver le bouton selon l'état des points rouges collectés
  if (allCollected) {
    onAllCollected(true);  // Active le bouton "Terminer"
  } else {
    onAllCollected(false); // Désactive le bouton
  }
}, [collectedPoints, onAllCollected]);


  useEffect(() => {
    if (resetMap) {
      setCollectedPoints(Array(points.length ).fill(false));
      console.log('Carte réinitialisée, collectedPoints:', Array(points.length).fill(false));
    }
  }, [resetMap, points.length]);

  
    // Fonction pour gérer le clic sur un point
    const handleMarkerClick = async (index: number) => {
      
      // Empêcher de cliquer sur le point de départ ou d'arrivée
      if (index === 0 || index === optimalPath.length - 1) {
        return;
      }
      
      // Vérifier que le point précédent a bien été collecté avant de cliquer sur celui-ci
      if (index > 1 && !collectedPoints[index - 1]) {
        console.log('Le point précédent n\'est pas collecté');
        return;
      }

      // Changer la couleur du point en vert immédiatement après le clic
      setCollectedPoints((prev) => {
        const newCollectedPoints = [...prev];
        newCollectedPoints[index] = true;  // Le point devient vert
        console.log('Nouvel état de collectedPoints après clic:', newCollectedPoints);
        return newCollectedPoints;
      });
  
       
      // Afficher la liste des binIds pour déboguer
      console.log('Liste des binIds:', binIds);
  
      // Récupérer l'ID de la poubelle correspondante
      const binId = binIds[index];
       // Vérifier que l'ID est bien défini
       if (!binId) {
       console.error('ID de la poubelle introuvable pour ce point');
       return;
      }

  
      // Appel à l'API pour mettre à jour le statut dans la base de données
      try {
        const response = await fetch(`http://localhost:5000/update-trash-bin-status/${binId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'vide'  // Mettez le nouveau statut ici
          })
        });
      
  
        if (response.ok) {
          console.log('Statut de la poubelle mis à jour avec succès dans la base de données');
        } else {
          console.error('Erreur lors de la mise à jour du statut:', response.statusText);
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
      }
    };
  

    // Création de l'icône de la poubelle
    const createIcon = (number: number, color: string = 'red', shape: string = 'circle') => {
      const size = 20;
      const style =
        shape === 'square'
          ? `background-color: ${color}; color: black; border-radius: 0; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;`
          : `background-color: ${color}; color: black; border-radius: 50%; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;`;
  
      return divIcon({
        html: `<div style="${style}">${number}</div>`,
        className: ''
      });
    };



  // Décoder les polylignes encodées et les transformer en LatLngTuple
  const decodedPolylines = itinerairesORS.map(itineraire => {
    if (itineraire.routes && itineraire.routes.length > 0 && itineraire.routes[0].geometry) {
      return polyline.decode(itineraire.routes[0].geometry).map(coord => [coord[0], coord[1]] as LatLngTuple);
    } else {
      return []; // Retourner un tableau vide si les données sont incorrectes
    }
  });
  


  // Fonction pour ajouter des flèches sur les polylignes (itinéraire)
  const AddPolylineDecorator = ({ polyline }: { polyline: LatLngTuple[] }) => {
    const map = useMap();
    useEffect(() => {
      const decorator = (window as any).L.polylineDecorator(polyline, {
        patterns: [
          {
            offset: 12,
            repeat: 20,
            symbol: (window as any).L.Symbol.arrowHead({
              pixelSize: 10,
              pathOptions: { fillOpacity: 1, weight: 0 }
            })
          }
        ]
      }).addTo(map);
      return () => {
        map.removeLayer(decorator);
      };
    }, [map, polyline]);

    return null;
  };



  return (
    <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {optimalPath.map((coord, index) => {
        let pointNumber;
        let shape = 'circle';
        let color = 'red';
        let isClickable = true;

        if (index === 0) {
          pointNumber = 0;
          shape = 'square';
          color = 'white';
          isClickable = false;
        } else if (index === optimalPath.length - 1) {
          pointNumber = optimalPath.length;
          shape = 'square';
          color = 'black';
          isClickable = false;
        } else {
          pointNumber = index;
        }

        const isCollected = collectedPoints[index];
        if (isCollected) {
          color = 'green';
          isClickable = false;
        }

        return (
          <Marker
            key={`optimal-${index}`}
            position={coord as LatLngTuple}
            icon={createIcon(pointNumber, color, shape)}
            eventHandlers={{
              click: () => isClickable && handleMarkerClick(index)
            }}
          />
        );
      })}

      {optimalPath.length > 0 && <Polyline positions={optimalPath} color="blue" />}

      {decodedPolylines.map((poly, index) => (
        <React.Fragment key={`poly-${index}`}>
          <Polyline positions={poly} color="red" />
          <AddPolylineDecorator polyline={poly} />
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
