import { useState, useEffect } from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    console.log("Vérification de l'état de connexion");
    fetch('/check_login')
      .then((res) => {
        console.log("Réponse de /check_login:", res);
        return res.json();
      })
      .then((data) => {
        console.log("Données reçues:", data);
        if (data.logged_in) {
          setLoggedIn(true);
          console.log("Utilisateur connecté");
        } else {
          setLoggedIn(false);
          console.log("Utilisateur non connecté");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la vérification de l'état de connexion:", error);
      });
  }, []);

  const handleLogout = () => {
    fetch('/logout', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Déconnexion réussie") {
          setLoggedIn(false);
          // Redirection ou mise à jour de l'interface utilisateur
        }
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
            {loggedIn ? (
              <>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white', marginRight: '30px' }}>
                    Profil
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><Link href="/profile" legacyBehavior><a className="dropdown-item">Mon Profil</a></Link></li>
                    <li><a className="dropdown-item" href="#" onClick={handleLogout}>Se déconnecter</a></li>
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
