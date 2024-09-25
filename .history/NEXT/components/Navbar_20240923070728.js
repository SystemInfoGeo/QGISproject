import Link from 'next/link'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { loggedIn, logout } = useAuth(); // Obtenez loggedIn et la fonction logout
  const router = useRouter(); 

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    logout(); // Déconnectez l'utilisateur
    router.push('/'); // Redirigez vers la page d'accueil ou une autre page
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#28a745', maxHeight: '70px' }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/" style={{ color: 'white', display: 'flex', alignItems: 'center', height: '100%' }}>
          <img src="/images/logo.jpg" alt="Logo" style={{ width: '70px', height: '70px', marginRight: '15px', objectFit: 'contain' }} />
          Clean Zone
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/" legacyBehavior>
                <a className="nav-link" style={{ color: 'white', marginRight: '20px' }}>Accueil</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/apropos" legacyBehavior>
                <a className="nav-link" style={{ color: 'white', marginRight: '20px' }}>À propos</a>
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white', marginRight: '20px' }}>
                Carte
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link href="/CARTE" legacyBehavior>
                    <a className="dropdown-item">Carte avec Chemin</a>
                  </Link>
                </li>
                <li>
                  <a className="dropdown-item" onClick={handleReportRedirect} style={{ cursor: 'pointer' }}>
                    Signaler une Poubelle
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link href="/contact" legacyBehavior>
                <a className="nav-link" style={{ color: 'white', marginRight: '20px' }}>Contact</a>
              </Link>
            </li>
            {!loggedIn ? (
              <>
                <li className="nav-item">
                  <Link href="/signup" legacyBehavior>
                    <a className="nav-link" style={{ color: 'white', marginRight: '20px' }}>S'inscrire</a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/login" legacyBehavior>
                    <a className="nav-link" style={{ color: 'white', marginRight: '20px' }}>Se connecter</a>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/user/profile" legacyBehavior>
                    <a className="nav-link" style={{ color: 'white', marginRight: '20px' }}>Mon Profil</a>
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" onClick={handleLogout} style={{ color: 'white', marginRight: '20px', cursor: 'pointer' }}>Se déconnecter</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
