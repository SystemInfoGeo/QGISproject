import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useAuth = () => {
  // Déclare un état pour suivre si l'utilisateur est authentifié ou non
  const [authenticated, setAuthenticated] = useState(false);
  
  // Utilise le hook useRouter de Next.js pour accéder aux fonctionnalités de routage
  const router = useRouter();

  // Utilise useEffect pour exécuter du code après le montage du composant
  useEffect(() => {
    // Vérifie si un token est présent dans le localStorage
    const token = localStorage.getItem('token');
    
    // Si un token est trouvé, l'utilisateur est considéré comme authentifié
    if (token) {
      setAuthenticated(true);
    } else {
      // Si aucun token n'est trouvé, l'utilisateur n'est pas authentifié
      setAuthenticated(false);
      // Remarque : Ici, on ne redirige pas l'utilisateur, on se contente de mettre à jour l'état
    }
  }, []); // Le tableau vide [] signifie que cet effet est exécuté une seule fois après le montage

  // Retourne l'état d'authentification (true ou false)
  return authenticated;
};

export default useAuth;
