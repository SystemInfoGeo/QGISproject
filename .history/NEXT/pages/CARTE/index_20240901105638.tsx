import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importer Bootstrap pour le style
import Navbar from '../components/Navbar'; // Importer le composant Navbar

// Définir les types des données que vous allez manipuler
interface Point {
  latitude: number;
  longitude: number;
}

interface OptimalPathData {
  points: Point[];
  optimal_path: [number, number][];
}

const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
});

export default function Carte() {
  const [data, setData] = useState<OptimalPathData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [allCollected, setAllCollected] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null); 
  const [resetMap, setResetMap] = useState<boolean>(false); 
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      console.log("Token vérifié:", token); // Log pour vérifier le token

      if (!token) {
        console.log("Token manquant, redirection vers la page de connexion."); // Log si le token est manquant
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchPath = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Token manquant, redirection vers la page de connexion."); // Log si le token est manquant
        router.push('/login');
        return;
      }

      try {
        console.log("Envoi de la requête à l'API avec le token:", token); // Log pour vérifier l'envoi de la requête
        const response = await fetch('/api/updateStatus', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
        });
        if (response.ok) {
          const result: OptimalPathData = await response.json();
          console.log("Données reçues de l'API:", result); // Log pour vérifier les données reçues
          setData(result);
        } else {
          console.log("Erreur lors de la récupération des données, statut:", response.status); // Log en cas d'erreur
          if (response.status === 401) {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error); // Log des erreurs lors de la récupération
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, [router]);

  useEffect(() => {
    console.log("Données chargées:", data); // Log pour vérifier les données chargées
    console.log("État de chargement:", loading); // Log pour vérifier l'état de chargement
  }, [data, loading]);

  const handleAllCollected = (collected: boolean) => {
    setAllCollected(collected);
    console.log('Tous les points sont collectés:', collected); // Log pour vérifier si tous les points sont collectés
  };

  const handleFinish = () => {
    if (data && data.points.length > 0) {
      console.log('Bouton Terminer cliqué. Données:', data); // Log pour vérifier lorsque le bouton "Terminer" est cliqué
      setMessage('Collecte terminée, BRAVO!');
    }
  };

  const handleCloseMessage = () => {
    console.log('Message fermé'); // Log pour vérifier la fermeture du message
    setMessage(null);
    setResetMap(true);
    setAllCollected(false);
    setData(null); 
  };

  useEffect(() => {
    if (resetMap) {
      console.log('Réinitialisation de la carte...'); // Log pour vérifier la réinitialisation de la carte
      setResetMap(false);
    }
  }, [resetMap]);

  return (
    <div style={{ padding: '0', margin: '0', fontFamily: 'Arial, sans-serif' }}>
      <Navbar /> {/* Inclusion de la Navbar */}
      
      <main style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'end', minHeight: '100vh', backgroundColor: '#343a40', color: '#fff' }}>
        {loading ? (
          <div style={{ padding: '20px' }}>Chargement...</div>
        ) : (
          <>
            {message && (
              <div style={{ padding: '10px', backgroundColor: '#28a745', borderRadius: '5px', cursor: 'pointer' }} onClick={handleCloseMessage}>
                {message}
              </div>
            )}
            <div style={{ width: '100%', height: '100%' }}>
              <MapComponent 
                points={data ? data.points : []} 
                optimalPath={data ? data.optimal_path : []} 
                onAllCollected={handleAllCollected} 
                resetMap={resetMap}
              />
            </div>
            <button 
              style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer' }} 
              onClick={handleFinish} 
              disabled={!allCollected}
            >
              Terminer
            </button>
          </>
        )}
      </main>

      <footer style={{ backgroundColor: '#343a40', color: '#fff', textAlign: 'center', padding: '10px' }}>
        <p>Contactez-nous pour plus d'informations</p>
        <p>&copy; {new Date().getFullYear()} Clean Zone</p>
      </footer>
    </div>
  );
}
