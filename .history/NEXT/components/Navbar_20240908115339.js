import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Profile = () => {
  const { loggedIn, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loggedIn) {
      router.push('/login');  // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
    }
  }, [loggedIn, router]);

  const handleLogout = () => {
    logout();
    router.push('/');  // Redirige vers la page d'accueil après déconnexion
  };

  return (
    <div className="container mt-5">
      <h1>Mon Profil</h1>
      <p>Voici vos informations personnelles :</p>
      <ul>
        <li><strong>Nom :</strong> Utilisateur Exemple</li>
        <li><strong>Email :</strong> utilisateur@exemple.com</li>
        {/* Vous pouvez ajouter d'autres informations ici */}
      </ul>

      <button className="btn btn-danger mt-3" onClick={handleLogout}>
        Se déconnecter
      </button>
    </div>
  );
};

export default Profile;
