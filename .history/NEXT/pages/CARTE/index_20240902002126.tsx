import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../../components/Navbar';
import styles from './Carte.module.css'; // Importer le fichier CSS
import { LatLngTuple } from 'leaflet';
import Link from 'next/link';

// Définir les types des données que vous allez manipuler
interface Point {
    latitude: number;
    longitude: number;
}

interface OptimalPathData {
    points: Point[];
    optimal_path: [number, number][];
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
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            console.log("Token vérifié:", token);

            if (!token) {
                console.log("Token manquant, redirection vers la page de connexion.");
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    useEffect(() => {
        const fetchPath = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log("Token manquant, redirection vers la page de connexion.");
                router.push('/login');
                return;
            }

            try {
                console.log("Envoi de la requête à l'API avec le token:", token);
                const response = await fetch('/api/updateStatus', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.ok) {
                    const result = await response.json();
                    console.log("Données reçues de l'API:", result);
                    setData(result);
                } else {
                    console.log("Erreur lors de la récupération des données, statut:", response.status);
                    if (response.status === 401) {
                        router.push('/login');
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPath();
    }, [router]);

    useEffect(() => {
        console.log("Données chargées:", data);
        console.log("État de chargement:", loading);
    }, [data, loading]);

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

    const handleCloseMessage = () => {
        console.log('Message fermé');
        setMessage(null);
        setResetMap(true);
        setAllCollected(false);
        setData(null);
    };

    useEffect(() => {
        if (resetMap) {
            console.log('Réinitialisation de la carte...');
            setResetMap(false);
        }
    }, [resetMap]);

    return (
        <div className={styles.container}>
            <Navbar /> {/* Inclusion de la Navbar */}
            <main className={styles.main}>
                {loading ? (
                    <div className={styles.loading}>Chargement...</div>
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
