import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); 
  const [token, setToken] = useState('');  // Ajout pour stocker et afficher le token

  // Vérification du token à chaque chargement de la page
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      console.log('Jeton déjà stocké :', storedToken);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setMessage(''); 

    if (!email || !password) {
      setError('Tous les champs sont requis.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, { email, password });
      const accessToken = response.data.access_token;
      localStorage.setItem('token', accessToken);  // Stocker le jeton
      setToken(accessToken);  // Stocker le jeton dans le state
      console.log('Jeton stocké :', accessToken);  // Afficher le jeton pour vérifier

      setMessage('Connexion réussie');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError('Identifiants incorrects. Veuillez réessayer.');
        } else if (error.response.status === 404) {
          setError('Aucun compte trouvé avec cette adresse e-mail. Veuillez vérifier votre saisie ou contacter l\'administrateur.');
        } else {
          setError('Erreur de connexion. Veuillez vérifier vos informations.');
        }
      } else {
        setError('Erreur de connexion. Veuillez vérifier votre connexion réseau.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour afficher le jeton depuis le localStorage
  const showToken = () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      alert(`Jeton JWT : ${storedToken}`);  // Utiliser un popup pour afficher le jeton
    } else {
      alert('Aucun jeton trouvé');
    }
  };

  return (
    <>
      <Navbar /> 
    
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <style jsx>{`
          .login-container {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            max-width: 400px;
            width: 100%;
          }
          .login-icon {
            width: 60px;
            height: 60px;
            background-color: #28a745;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 20px;
          }
          .login-icon img {
            width: 30px;
          }
          .login-btn {
            background-color: #28a745;
            color: white;
          }
        `}</style>

        <div className="login-container">
          <div className="login-icon mb-4 mx-auto d-flex justify-content-center align-items-center">
            <img src="/images/USERICON.jpg" alt="User Icon" />
          </div>
          <h3 className="text-center mb-4">Se connecter</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Adresse Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
            {error && <p className="text-danger mt-3">{error}</p>}
            {message && <p className="text-success mt-3">{message}</p>}
          </form>
          
          {/* Ajouter un bouton pour afficher le token */}
          <div className="text-center mt-3">
            <button className="btn btn-secondary" onClick={showToken}>Afficher le jeton</button>
          </div>

          <div className="text-center mt-3">
            <p>Vous n'avez pas de compte ? <a href="/signup">Inscrivez-vous</a></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
