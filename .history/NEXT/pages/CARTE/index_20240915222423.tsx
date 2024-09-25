'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './carte.module.css'; // Importer le fichier CSS
import { LatLngTuple } from 'leaflet';
import { Circles } from 'react-loader-spinner'; // Pour l'indicateur de chargement

// Interface pour représenter un point avec latitude et longitude
interface Point {
    latitude: number;
    longitude: number;
}

// Interface pour représenter les données du chemin optimal et les itinéraires
interface OptimalPathData {
    points: Point[];
    optimal_path: [number, number][];
    itineraires_ors: { routes: { geometry: string }[] }[]; // Structure correcte pour les itinéraires ORS
}

// Import dynamique du composant MapComponent avec désactivation du rendu côté serveur
const MapComponent = dynamic(() => import('../../components/MapComponent'), {
    ssr: false,
});

export default function Carte() {
    const [data, setData] = useState<OptimalPathData | null>(null); // État pour stocker les données de la carte
    const [loading, setLoading] = useState(true); // État pour gérer le chargement des données
    const [allCollected, setAllCollected] = useState(false); // État pour indiquer si tous les points sont collectés
    const [message, setMessage] = useState<string | null>(null); // Message pour afficher le statut
    const [resetMap, setResetMap] = useState(false); // État pour réinitialiser la carte

    // Fonction pour charger les données de l'API lors du chargement de la page
    useEffect(() => {
        const fetchPath = async () => {
            try {
                const response = await fetch('/api/updateStatus', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log("Données reçues de l'API:", result);

                    // Extraire les polylignes encodées des itinéraires ORS
                    const itinerairesORS = result.itineraires_ors
                        .map((itinerary: any) => itinerary.routes.map((route: any) => route.geometry))
                        .flat();

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

    // Fonction pour mettre à jour l'état lorsque tous les points sont collectés
    const handleAllCollected = (collected: boolean) => {
        setAllCollected(collected);
        console.log('Tous les points sont collectés:', collected);
    };

    // Fonction appelée lorsque le bouton "Terminer" est cliqué
    const handleFinish = () => {
        if (data && data.points.length > 0) {
            console.log('Bouton Terminer cliqué. Données:', data);
            setMessage('Collecte terminée, BRAVO!');
        }
    };

    // Fonction appelée pour réinitialiser la collecte lorsque le message de fin est fermé
    const handleCloseMessage = async () => {
        if (data) {
            try {
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

        // Réinitialiser les états et les données
        setMessage(null);
        setResetMap(false);
        setAllCollected(false);
        setData(null);
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
                                itinerairesORS={data ? data.itineraires_ors : []}
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
