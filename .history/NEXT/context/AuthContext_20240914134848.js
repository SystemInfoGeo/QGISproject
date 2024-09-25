import { createContext, useContext, useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import jwt_decode from 'jwt-decode';

// Créez le contexte
const AuthContext = createContext();

// Créez un hook pour utiliser le contexte facilement
export const useAuth = () => useContext(AuthContext);

// Créer un fournisseur pour encapsuler l'état de connexion global
export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);  // Indicateur de chargement
  const [user, setUser] = useState(null);        // Stockage des informations utilisateur

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

  // Vérification de la connexion au démarrage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');

    // Vérification de la présence des données
    if (token && userInfo) {
      try {
        // Vérifier si le token est valide
        if (isTokenValid(token)) {
          setLoggedIn(true);

          // Essayer de parser les informations utilisateur
          try {
            const parsedUser = JSON.parse(userInfo);  // Charger les informations utilisateur
            setUser(parsedUser);
          } catch (error) {
            console.error("Erreur lors du parsing des informations utilisateur:", error);
            localStorage.removeItem('user');  // Supprimer les données corrompues
            setUser(null);
            setLoggedIn(false);
          }
        } else {
          // Le token est expiré ou invalide
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Erreur lors du traitement de la connexion:", error);
        setLoggedIn(false);
      }
    } else {
      // Si le token ou les infos utilisateur sont manquants
      console.warn("Aucun token ou informations utilisateur trouvés.");
      setLoggedIn(false);
    }

    setLoading(false);  // Fin du chargement
  }, []);

  // Fonction de connexion
  const login = (token, userInfo) => {
    if (token && userInfo) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));  // Enregistrer les informations utilisateur
      setUser(userInfo);
      setLoggedIn(true);
    } else {
      console.error("Le token ou les informations utilisateur sont manquants.");
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);  // Réinitialiser les informations utilisateur
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, loading, user }}>
      {loading ? <Spinner animation="border" role="status" /> : children} {/* Afficher un spinner si en chargement */}
    </AuthContext.Provider>
  );
};
