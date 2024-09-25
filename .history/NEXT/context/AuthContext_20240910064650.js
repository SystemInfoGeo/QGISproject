import { createContext, useContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { Spinner } from 'react-bootstrap';


// Créez le contexte
const AuthContext = createContext();

// Créez un hook pour utiliser le contexte facilement
export const useAuth = () => useContext(AuthContext);

// Créez un fournisseur pour encapsuler l'état de connexion global
export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);  // Déplacement du hook ici
  const [user, setUser] = useState(null);        // Déplacement du hook ici

  // Vérification de la connexion au démarrage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');
    if (token && userInfo) {
      const decodedToken = jwt_decode(token); // Correction ici
      const currentTime = Date.now() / 1000; // en secondes
      if (decodedToken.exp > currentTime) {
        setLoggedIn(true);
        setUser(JSON.parse(userInfo));  // Charger les informations utilisateur
      } else {
        // Token expiré, le supprimer
        localStorage.removeItem('token');  
        localStorage.removeItem('user');
        setLoggedIn(false);
      }
    } else {
      setLoggedIn(false);
    }
    setLoading(false);  // Terminer la vérification
  }, []);

  const login = (token, userInfo) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userInfo));  // Enregistrer les informations utilisateur
    setUser(userInfo);
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);  // Réinitialiser l'utilisateur
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, loading, user }}>
      {loading ? <Spinner animation="border" role="status" /> : children} {/* Afficher un spinner si en chargement */}
    </AuthContext.Provider>
  );
};
