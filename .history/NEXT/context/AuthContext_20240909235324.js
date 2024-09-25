import { createContext, useContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
const [loading, setLoading] = useState(true);
const [user, setUser] = useState(null);

// Créez le contexte
const AuthContext = createContext();

// Créez un hook pour utiliser le contexte facilement
export const useAuth = () => useContext(AuthContext);

// Créez un fournisseur pour encapsuler l'état de connexion global
export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  // Vérification de la connexion au démarrage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');
    if (token  && userInfo) {
      const decodedToken = jwtDecode(token);
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
  }else {
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
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, loading }}>
      {loading ? <Spinner /> :children}
    </AuthContext.Provider>
  );
};
