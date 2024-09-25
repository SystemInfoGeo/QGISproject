import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode'; // Pour décoder le token JWT

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Ajout d'un indicateur de chargement
  const router = useRouter();

  // Fonction pour vérifier si le token est valide
  const isTokenValid = (token) => {
    try {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000; // Le temps actuel en secondes
      return decodedToken.exp > currentTime; // Retourne true si le token n'a pas expiré
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && isTokenValid(token)) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      router.push('/login'); // Rediriger l'utilisateur vers la page de login s'il n'est pas authentifié
    }
    
    setLoading(false); // Fin du chargement après vérification
  }, [router]);

  // Retourne l'état d'authentification et l'indicateur de chargement
  return { authenticated, loading };
};

export default useAuth;
