import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { LatLngTuple, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from '@mapbox/polyline'; // Pour décoder les polylignes encodées
import 'leaflet-polylinedecorator'; // Pour ajouter des flèches aux polylignes
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Circles } from 'react-loader-spinner';

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
  itinerairesORS?: ItinerairesORS[]; // Polylignes encodées sous forme d'objet
  onAllCollected: (collected: boolean) => void;
  resetMap: boolean;
}

const MapComponent: React.FC<MapProps> = ({
  points = [],
  optimalPath = [],
  itinerairesORS = [], // Définir ici pour éviter l'erreur de non-définition
  onAllCollected,
  resetMap
}) => {
  const center: LatLngTuple = [36.712776, 4.040093]; // Coordonnées centrales de la carte
  const [collectedPoints, setCollectedPoints] = useState<boolean[]>(Array(points.length + 2).fill(false));

  useEffect(() => {
    console.log('Points reçus:', points);
    setCollectedPoints(Array(points.length + 2).fill(false));
  }, [points]);

  useEffect(() => {
    const allCollected = collectedPoints.slice(1, collectedPoints.length - 1).every(point => point);
    console.log('Tous les points sont collectés:', allCollected);
    onAllCollected(allCollected);
  }, [collectedPoints, onAllCollected]);

  useEffect(() => {
    if (resetMap) {
      setCollectedPoints(Array(points.length + 2).fill(false));
    }
  }, [resetMap, points.length]);

  const handleMarkerClick = (index: number) => {
    if (index === 0 || index === optimalPath.length - 1) {
      return;
    }
    if (index > 1 && !collectedPoints[index - 1]) {
      console.log('Le point précédent n\'est pas collecté, index actuel:', index);
      return;
    }
    setCollectedPoints((prev) => {
      const newCollectedPoints = [...prev];
      newCollectedPoints[index] = true;
      console.log('Point collecté, index:', index);
      return newCollectedPoints;
    });
  };

  const createIcon = (number: number, color: string = 'red', shape: string = 'circle') => {
    const size = 20;
    const style =
      shape === 'square'
        ? `background-color: ${color}; color: black; border-radius: 0; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;`
        : `background-color: ${color}; color: black; border-radius: 50%; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;`;

    console.log('Création d\'une icône:', { number, color, shape });
    return divIcon({
      html: `<div style="${style}">${number}</div>`,
      className: ''
    });
  };

  // Décoder les polylignes encodées et les transformer en LatLngTuple
  const decodedPolylines = itinerairesORS.map(itineraire => {
    return polyline.decode(itineraire.routes[0].geometry).map(coord => [coord[0], coord[1]] as LatLngTuple);
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

      {/* Ajouter les polylignes ORS si elles sont présentes */}
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
