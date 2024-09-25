import Link from 'next/link';
import { useAuth } from '../context/AuthContext'; // Importer le hook useAuth
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; // Importer le fichier CSS

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
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src="/images/logo.jpg" alt="Logo" className="logo" />
          Clean Zone
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/" legacyBehavior>
                <a className="nav-link custom-nav-link">Accueil</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/apropos" legacyBehavior>
                <a className="nav-link custom-nav-link">À propos</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/CARTE" legacyBehavior>
                <a className="nav-link custom-nav-link">Carte</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" legacyBehavior>
                <a className="nav-link custom-nav-link">Contact</a>
              </Link>
            </li>

            {/* Affichage conditionnel basé sur l'état de connexion et le rôle */}
            {loggedIn ? (
              <li className="nav-item">
                {userRole === 'admin' ? (
                  <Link href="/admin/profile" legacyBehavior>
                    <a className="nav-link custom-nav-link">Profil Admin</a>
                  </Link>
                ) : (
                  <Link href="/user/profile" legacyBehavior>
                    <a className="nav-link custom-nav-link">Profil</a>
                  </Link>
                )}
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/signup" legacyBehavior>
                    <a className="nav-link custom-nav-link">S'inscrire</a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/login" legacyBehavior>
                    <a className="nav-link custom-nav-link">Se connecter</a>
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
