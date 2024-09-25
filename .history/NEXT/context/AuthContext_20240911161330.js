import { createContext, useContext, useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { jwt_decode } from 'jwt-decode';


// Créez le contexte
const AuthContext = createContext();

// Créez un hook pour utiliser le contexte facilement
export const useAuth = () => useContext(AuthContext);

// Créez un fournisseur pour encapsuler l'état de connexion global
export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);  // Indicateur de chargement
  const [user, setUser] = useState(null);        // Stockage des informations utilisateur

  // Vérification de la connexion au démarrage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');
    
    if (token && userInfo) {
      try {
        const decodedToken = jwt_decode(token); // Décodage du token JWT
        const currentTime = Date.now() / 1000; // Temps actuel en secondes

        if (decodedToken.exp > currentTime) {
          // Si le token n'a pas expiré, connexion valide
          setLoggedIn(true);
          setUser(JSON.parse(userInfo));  // Charger les informations utilisateur
        } else {
          // Si le token a expiré, on le supprime
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setLoggedIn(false);
        }
      } catch (error) {
        // Gestion des erreurs de décodage ou de token invalide
        console.error("Erreur lors du décodage du token:", error);
        setLoggedIn(false);
      }
    } else {
      setLoggedIn(false);
    }
    setLoading(false);  // Fin du chargement
  }, []);

  // Fonction de connexion
  const login = (token, userInfo) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userInfo));  // Enregistrer les informations utilisateur
    setUser(userInfo);
    setLoggedIn(true);
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
