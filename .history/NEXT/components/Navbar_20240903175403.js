import { useState, useEffect } from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/check_session`)
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
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
          router.push('/'); // Redirection après déconnexion
        }
      })
      .catch((error) => console.error('Erreur:', error));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link href="/">Home</Link>
        {loggedIn ? (
          <>
            <Link href="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

