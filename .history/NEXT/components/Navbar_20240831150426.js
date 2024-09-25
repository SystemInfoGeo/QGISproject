import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Vérifiez si l'utilisateur est connecté
    axios.get('/check_login')
      .then(response => {
        if (response.data.logged_in) {
          setIsLoggedIn(true);
          setUser(response.data.user);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(error => {
        console.error("Erreur lors de la vérification de la connexion :", error);
      });
  }, []);

  const handleLogout = () => {
    axios.post('/logout')
      .then(() => {
        setIsLoggedIn(false);
        setUser(null);
      })
      .catch(error => {
        console.error("Erreur lors de la déconnexion :", error);
      });
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
              <a className="nav-link" href="/" style={{ color: 'white', marginRight: '30px' }}>Accueil</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about" style={{ color: 'white', marginRight: '30px' }}>À propos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/CARTE" style={{ color: 'white', marginRight: '30px' }}>Carte</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/contact" style={{ color: 'white', marginRight: '30px' }}>Contact</a>
            </li>
            {isLoggedIn ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white', marginRight: '30px' }}>
                  {user}
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="/profile">Mon Profil</a></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Se déconnecter</button></li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/signup" style={{ color: 'white', marginRight: '30px' }}>S'inscrire</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/login" style={{ color: 'white' }}>Se connecter</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
