'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../../components/Navbar';
import styles from './carte.module.css'; // Importer le fichier CSS
import { LatLngTuple } from 'leaflet';
import Link from 'next/link';
import { Circles } from 'react-loader-spinner'; // Pour l'indicateur de chargement

// Définir les types des données que vous allez manipuler
interface Point {
    latitude: number;
    longitude: number;
}

interface OptimalPathData {
    points: Point[];
    optimal_path: [number, number][];
    itineraires_ors: { routes: { geometry: string }[] }[]; // Structure correcte pour les itinéraires ORS
}


const MapComponent = dynamic(() => import('../../components/MapComponent'), {
    ssr: false,
});

export default function Carte() {
    const [data, setData] = useState<OptimalPathData | null>(null);
    const [loading, setLoading] = useState(true);
    const [allCollected, setAllCollected] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [resetMap, setResetMap] = useState(false);
    
    // Charger les données lors du chargement de la page
    useEffect(() => {
        const fetchPath = async () => {
          try{
            const response = await fetch('/api/updateStatus', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',   
                    },
                });
                if (response.ok) {
                    const result = await response.json();
                    console.log("Données reçues de l'API:", result);
                              // Extraire les géométries (polylignes encodées) des itinéraires
                    const itinerairesORS = result.itineraires_ors.map((itinerary: any) => {
                     return itinerary.routes.map((route:any) => route.geometry); // Extraire les polylignes encodées
                     }).flat();
                               // Mettre à jour les données avec les itinéraires ORS décodés
          setData({ ...result, itineraires_ors: itinerairesORS });
        } else {
          console.error('Error fetching data:', response.statusText);
          setMessage(`Erreur : ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Erreur lors de la récupération des données, veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, []);

  const handleAllCollected = (collected: boolean) => {
        setAllCollected(collected);
        console.log('Tous les points sont collectés:', collected);
    };

    const handleFinish = () => {
        if (data && data.points.length > 0) {
            console.log('Bouton Terminer cliqué. Données:', data);
            setMessage('Collecte terminée, BRAVO!');
        }
    };
    // Fonction appelée lorsqu'on ferme le message de fin de collecte
  const handleCloseMessage = async () => {
    if (data) {
      try {
        // Envoyer une requête DELETE pour réinitialiser les données sur le serveur
        const response = await fetch('/api/updateStatus', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log('Données réinitialisées avec succès');
        } else {
          console.error('Erreur lors de la réinitialisation des données:', response.statusText);
          setMessage('Erreur lors de la réinitialisation des données.');
        }
      } catch (error) {
        console.error('Erreur lors de la réinitialisation des données:', error);
        setMessage('Erreur lors de la réinitialisation des données.');
      }
    }
    setMessage(null);
    setResetMap(false);
    setAllCollected(false);
    setData(null); // Réinitialiser les données affichées
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Chemin de Collecte Optimisé</h1>
      </header>
      <main className={styles.main}>
        {loading ? (
          <div className={styles.loader}>
            <Circles height="80" width="80" color="#4fa94d" />
          </div>
        ) : (
          <>
            {message && (
              <div className={styles.message} onClick={handleCloseMessage}>
                {message}
              </div>
            )}
            <div className={styles.map}>
              <MapComponent 
                points={data ? data.points : []} 
                optimalPath={data ? data.optimal_path as LatLngTuple[] : []}
                itinerairesORS={data ? data.itineraires_ors : []} // Passer les itinéraires encodés

 
                                onAllCollected={handleAllCollected}
                                resetMap={resetMap}
                            />
                        </div>
                        <button
                            className={styles.finishButton}
                            onClick={handleFinish}
                            disabled={!allCollected}
                        >
                            Terminer
                        </button>
                    </>
                )}
            </main>

            <footer className={styles.footer}>
                <p>Contactez-nous pour plus d'informations</p>
                <p>&copy; {new Date().getFullYear()} Clean Zone</p>
            </footer>
        </div>
    );
}
