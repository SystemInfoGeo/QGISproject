import Link from 'next/link'; 
import { useAuth } from '../context/AuthContext'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { loggedIn } = useAuth(); 
  const [userRole, setUserRole] = useState(null); 

  useEffect(() => {
    const role = localStorage.getItem('role'); 
    if (role) {
      setUserRole(role); 
      console.log('Rôle de l’utilisateur:', role); 
    } else {
      console.log('Aucun rôle trouvé dans le localStorage');
    }
  }, []);

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
                <a className="nav-link" style={{ color: 'white', marginRight: '30px' }}>Accueil</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/apropos" legacyBehavior>
                <a className="nav-link" style={{ color: 'white', marginRight: '30px' }}>À propos</a>
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: 'white', marginRight: '30px' }}>
                Carte
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link href="/CARTE" legacyBehavior>
                    <a className="dropdown-item">Carte avec Chemin</a>
                  </Link>
                </li>
                <li>
                  <Link href="/report" legacyBehavior>
                    <a className="dropdown-item">Signaler une Poubelle</a>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link href="/contact" legacyBehavior>
                <a className="nav-link" style={{ color: 'white', marginRight: '30px' }}>Contact</a>
              </Link>
            </li>
            {loggedIn ? (
              <li className="nav-item">
                {userRole === 'admin' ? (
                  <Link href="/admin/profile" legacyBehavior>
                    <a className="nav-link" style={{ color: 'white', marginRight: '30px' }}>
                      Profil Admin
                    </a>
                  </Link>
                ) : (
                  <Link href="/user/profile" legacyBehavior>
                    <a className="nav-link" style={{ color: 'white', marginRight: '30px' }}>
                      Profil
                    </a>
                  </Link>
                )}
              </li>
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