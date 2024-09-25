import Link from 'next/link';
import { useAuth } from '../context/AuthContext'; // Importer le hook useAuth
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { loggedIn } = useAuth(); // Utiliser le hook pour accéder à l'état de connexion
  const [userRole, setUserRole] = useState(null); // Stocker le rôle de l'utilisateur

  // Vérification du rôle de l'utilisateur lors du chargement de la page
  useEffect(() => {
    const role = localStorage.getItem('role'); // Récupérer le rôle depuis localStorage
    if (role) {
      setUserRole(role); // Mettre à jour le rôle de l'utilisateur dans le state
      console.log('Rôle de l’utilisateur:', role); // Afficher le rôle dans la console pour déboguer
    } else {
      console.log('Aucun rôle trouvé dans le localStorage');
    }
  }, []);

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

            {/* Affichage conditionnel basé sur l'état de connexion et le rôle */}
            {loggedIn ? (
              <li className="nav-item">
                {/* Si l'utilisateur est admin, rediriger vers le profil admin, sinon vers le profil utilisateur */}
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
