import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importer Bootstrap pour le style

const MapComponent = dynamic(() => import('../../components/MapComponent'), {
  ssr: false,
});

export default function Carte() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allCollected, setAllCollected] = useState(false);
  const [message, setMessage] = useState(null); 
  const [resetMap, setResetMap] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      fetch('/api/protected-map', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) {
          setMessage('Accès refusé. Redirection vers la page de connexion...');
          router.push('/login');
        } else {
          fetchPath();
        }
      })
      .catch(() => {
        setMessage('Erreur lors de la vérification de l\'authentification.');
        router.push('/login');
      });
    }
  }, [router]);

  const fetchPath = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/updateStatus', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        console.error('Error fetching data:', response.statusText);
        if (response.status === 401) {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Data loaded:", data); 
    console.log("Loading state:", loading);
  }, [data, loading]);

  const handleAllCollected = (collected) => {
    setAllCollected(collected);
  };

  const handleFinish = () => {
    if (data && data.points.length > 0) {
      setMessage('Collecte terminée, BRAVO!');
    }
  };

  const handleCloseMessage = () => {
    setMessage(null);
    setResetMap(true);
    setAllCollected(false);
    setData(null); 
  };

  useEffect(() => {
    if (resetMap) {
      console.log('Map reset initiated');
      setResetMap(false);
    }
  }, [resetMap]);

  return (
    <div className="container-fluid p-0">
      <header className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src="/images/logo.jpg" alt="Logo" width={40} height={40} className="me-3" />
            <h1 className="h4 m-0">Clean Zone</h1>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">Accueil</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">À propos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/carte">Carte</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact">Contact</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/signup">S'inscrire</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/login">Se connecter</a>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <main className="position-relative d-flex flex-column align-items-center justify-content-end vh-100 bg-dark text-white">
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <>
            {message && (
              <div onClick={handleCloseMessage}>
                {message}
              </div>
            )}
            <div>
              <MapComponent 
                points={data ? data.points : []} 
                optimalPath={data ? data.optimal_path : []} 
                onAllCollected={handleAllCollected} 
                resetMap={resetMap}
              />
            </div>
            <button 
              onClick={handleFinish} 
              disabled={!allCollected}
            >
              Terminer
            </button>
          </>
        )}
      </main>

      <footer className="bg-dark text-white text-center py-3">
        <p>Contactez-nous pour plus d'informations</p>
        <p>&copy; {new Date().getFullYear()} Clean Zone</p>
      </footer>
    </div>
  );
}
