import { useState, useEffect } from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("Vérification de l'état de connexion");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/check_login`)  // Utilisez cette URL pour vérifier la session
      .then((res) => res.json())
      .then((data) => {
        setLoggedIn(!!data.email);  // Déterminez l'état de connexion
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
      <div className="container">
        <Link href="/">Accueil</Link>
        <Link href="/about">À propos</Link>
        <Link href="/map">Carte</Link>
        <Link href="/contact">Contact</Link>

        {loggedIn ? (
          <>
            <Link href="/profile">Profil</Link>
            <button onClick={handleLogout} className="btn btn-outline-danger">Déconnexion</button>
          </>
        ) : (
          <>
            <Link href="/login">Se connecter</Link>
            <Link href="/signup">S'inscrire</Link>
          </>
        )}
      </div>
    </nav>
  );
}

