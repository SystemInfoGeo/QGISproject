
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { LatLngTuple, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from '@mapbox/polyline'; // Importer la bibliothèque polyline pour décoder
import 'leaflet-polylinedecorator'; // Importer pour ajouter des flèches aux polylignes

interface Point {
  latitude: number;
  longitude: number;
}


interface ItinerairesORS {
  routes: { geometry: string }[]; // Structure d'un itinéraire venant de flaskkkk 
}

interface MapProps {
  points?: Point[];
  optimalPath?: LatLngTuple[];
  //itinerairesORS?: string[]; // Les polylignes encodées
  itinerairesORS?: ItinerairesORS[]; 
  onAllCollected: (collected: boolean) => void;
  resetMap: boolean;
}

const MapComponent: React.FC<MapProps> = ({ points = [], optimalPath = [], itinerairesORS = [], onAllCollected, resetMap }) => {
  const center: LatLngTuple = [36.712776, 4.040093];
  const [collectedPoints, setCollectedPoints] = useState<boolean[]>(Array(points.length + 2).fill(false));

  useEffect(() => {
    setCollectedPoints(Array(points.length + 2).fill(false)); // Reset collectedPoints if points change
  }, [points]);

  useEffect(() => {
    const allCollected = collectedPoints.slice(1, collectedPoints.length - 1).every(point => point);
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
      return;
    }
    setCollectedPoints((prev) => {
      const newCollectedPoints = [...prev];
      newCollectedPoints[index] = true;
      return newCollectedPoints;
    });
  };

  const createIcon = (number: number, color: string = 'red', shape: string = 'circle') => {
    const size = 20;
    const style = shape === 'square'
      ? `background-color: ${color}; color: black; border-radius: 0; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;`
      : `background-color: ${color}; color: black; border-radius: 50%; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;`;
    
    return divIcon({
      html: `<div style="${style}">${number}</div>`,
      className: ''
    });
  };

  // Décoder les polylignes encodées et les transformer en LatLngTuple
  const decodedPolylines = itinerairesORS.map(itineraireEncoded => {
    return polyline.decode(itineraireEncoded).map(coord => [coord[0], coord[1]] as LatLngTuple);
  });

  // Fonction pour ajouter des flèches sur le polyline (itinéraire)
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
              pathOptions: { fillOpacity: 1, weight: 0 },
            }),
          },
        ],
      }).addTo(map);
      return () => {
        map.removeLayer(decorator);
      };
    }, [map, polyline]);

    return null;
  };

  return (
    <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Afficher les itinéraires décodés avec des flèches */}
      {decodedPolylines.map((polylineCoords, index) => (
        <React.Fragment key={`polyline-${index}`}>
          <Polyline positions={polylineCoords} color="blue" />
          <AddPolylineDecorator polyline={polylineCoords} /> {/* Ajout des flèches */}
        </React.Fragment>
      ))}

      {/* Afficher les points dans l'ordre optimal */}
      {optimalPath.map((coord, index) => {
        let pointNumber;
        let shape = 'circle';
        let color = 'red';
        let isClickable = true;

        if (index === 0) {
          pointNumber = 0; // Point de départ
          shape = 'square';
          color = 'white'; // Couleur du point de départ
          isClickable = false;
        } else if (index === optimalPath.length - 1) {
          pointNumber = optimalPath.length; // Point d'arrivée
          shape = 'square';
          color = 'black'; // Couleur du point d'arrivée
          isClickable = false;
        } else {
          pointNumber = index;
        }

        const isCollected = collectedPoints[index];
        if (isCollected) {
          color = 'green'; // Couleur des points collectés
          isClickable = false;
        }

        return (
          <Marker
            key={`optimal-${index}`}
            position={coord as LatLngTuple}
            icon={createIcon(pointNumber, color, shape)}
            eventHandlers={{
              click: () => isClickable && handleMarkerClick(index),
            }}
          />
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;
