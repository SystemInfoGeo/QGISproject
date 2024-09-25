import { useState, useEffect } from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/check_session`)  // Assurez-vous que l'URL correspond à votre route Flask
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {  // Vérifiez si les données de l'utilisateur sont présentes
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      })
      .catch((error) => console.error('Erreur:', error));
  }, []);

  const handleLogout = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/logout`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Déconnexion réussie") {
          setLoggedIn(false);
          router.push('/'); // Redirection vers la page d'accueil après déconnexion
        }
      })
      .catch((error) => console.error('Erreur:', error));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">MonSite</a>
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          {loggedIn ? (
            <>
              <li className="nav-item">
                <Link href="/profile">
                  <a className="nav-link">Profil</a>
                </Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link href="/login">
                  <a className="nav-link">Se connecter</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/signup">
                  <a className="nav-link">S'inscrire</a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
