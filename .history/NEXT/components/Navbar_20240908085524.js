import { useState, useEffect } from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  // Vérification de l'état de connexion au chargement de la page
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Faire une requête pour valider le token côté serveur
      fetch('/api/validate_token', { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setLoggedIn(true);  // Si le token est valide, l'utilisateur est connecté
          } else {
            setLoggedIn(false); // Si le token est invalide, l'utilisateur n'est pas connecté
            localStorage.removeItem('token'); // Supprimer le token invalide
          }
        })
        .catch((error) => {
          console.error('Erreur de validation du token:', error);
          setLoggedIn(false);
        });
    }
  }, []);

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');  // Supprimer le token du localStorage
    setLoggedIn(false);  // Mettre à jour l'état local
    router.push('/'); // Redirection vers la page d'accueil
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#808080' }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
          <img src="/images/logo.jpg" alt="Logo" style={{ width: '40px', height: '40px', marginRight: '15px' }} />
          Clean Zone
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/" legacyBehavior>
                <a className="nav-link" style={{ color: 'white', marginRight: '30px' }}>Accueil</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#about" legacyBehavior>
                <a className="nav-link" style={{ color: 'white', marginRight: '30px' }}>À propos</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/CARTE" legacyBehavior>
                <a className="nav-link" style={{ color: 'white', marginRight: '30px' }}>Carte</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" legacyBehavior>
                <a className="nav-link" style={{ color: 'white', marginRight: '30px' }}>Contact</a>
              </Link>
            </li>
            
            {/* Affichage conditionnel basé sur l'état de connexion */}
            {loggedIn ? (
              <>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white', marginRight: '30px' }}>
                    Profil
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li>
                      <Link href="/profile" legacyBehavior>
                        <a className="dropdown-item">Mon Profil</a>
                      </Link>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={handleLogout}>Se déconnecter</a>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/signup" legacyBehavior>
                    <a className="nav-link" style={{ color: 'white', marginRight: '30px' }}>S'inscrire</a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/login" legacyBehavior>
                    <a className="nav-link" style={{ color: 'white' }}>Se connecter</a>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
