import Link from 'next/link';
import { useAuth } from '../context/AuthContext'; // Importer le hook useAuth
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { loggedIn, logout } = useAuth(); // Utiliser le hook pour accéder à l'état de connexion
  const router = useRouter();

  const handleLogout = () => {
    logout();  // Utiliser la fonction de déconnexion depuis le contexte
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
                <li className="nav-item">
                  <Link href="/profile" legacyBehavior>
                    <a className="nav-link" style={{ color: 'white', marginRight: '30px' }}>
                      Profil
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#" onClick={handleLogout} style={{ color: 'white', marginRight: '30px' }}>
                    Se déconnecter
                  </a>
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
