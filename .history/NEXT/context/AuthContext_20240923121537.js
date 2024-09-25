import { createContext, useContext, useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import jwt_decode from 'jwt-decode';

// Créez le contexte d'authentification
const AuthContext = createContext();

// Hook pour accéder au contexte
export const useAuth = () => useContext(AuthContext);

// Fournisseur d'authentification
export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);  // Indicateur de chargement
  const [user, setUser] = useState(null);        // Stockage des informations utilisateur
  const router = useRouter();
  // Fonction pour vérifier la validité du token
  const isTokenValid = (token) => {
    try {
      const decodedToken = jwt_decode(token);  // Décodage du token JWT
      const currentTime = Date.now() / 1000;  // Temps actuel en secondes
      if (decodedToken.exp > currentTime) {
        return true;  // Le token est valide
      } else {
        console.warn("Le token a expiré.");
        return false;  // Le token est expiré
      }
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
      return false;  // Le token est invalide
    }
  };

  // Vérification de l'état de connexion au démarrage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');

    if (token && userInfo) {
      if (isTokenValid(token)) {
        try {
          const parsedUser = JSON.parse(userInfo);  // Parser les infos utilisateur
          setUser(parsedUser);
          setLoggedIn(true);  // L'utilisateur est connecté
        } catch (error) {
          console.error("Erreur lors du parsing des informations utilisateur:", error);
          localStorage.removeItem('user');
          setUser(null);
          setLoggedIn(false);
        }
      } else {
        console.warn("Le token est expiré ou invalide.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoggedIn(false);
        setUser(null);
      }
    } else {
      console.warn("Aucun token ou informations utilisateur trouvés.");
      setLoggedIn(false);
    }

    setLoading(false);  // Le chargement est terminé
  }, []);

  // Fonction de connexion
  const login = (token, userInfo) => {
    if (token && userInfo) {
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);
        setLoggedIn(true);
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des données:", error);
      }
    } else {
      if (!token) {
        console.error("Le token est manquant.");
      }
      if (!userInfo) {
        console.error("Les informations utilisateur sont manquantes.");
      }
    }
  };
  

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    //  Mise à jour de l'état
    setLoggedIn(false);
    setUser(null);
    router.push('/login'); // Utilisez router.push pour rediriger
  };

  
  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, loading, user }}>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
