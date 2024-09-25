import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../styles/Login.css';
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';  // Import de js-cookie
import { useEffect } from 'react';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const router = useRouter();

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
      console.log(response.data); 
      const { acess_token, role } = response.data;
        // Stocker le token
    localStorage.setItem('access_token', access_token);
    console.log('Token stocké:', localStorage.getItem('access_token')); // Vérifiez le token ici

    // Stocker le rôle dans localStorage
      localStorage.setItem('role', role);
  
      login(token);
      setMessage('Connexion réussie');
  
      router.push('/user/report');
  
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError('Identifiants incorrects. Veuillez réessayer.');
        } else if (error.response.status === 404) {
          setError('Aucun compte trouvé avec cette adresse e-mail.');
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
  

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };



  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-box">
          <div className="icon-container">
            <FontAwesomeIcon icon={faUser} size="2x" className="icon" />
          </div>
          <h3 className="text-center mb-4">Connexion</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Adresse Email</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope} /></span>
                </div>
                <input
                  type="email"
                  id="email"
                  placeholder="Entrez votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-control"
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text"><FontAwesomeIcon icon={faLock} /></span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-control"
                />
                <div className="input-group-append">
                  <span className="input-group-text" onClick={toggleShowPassword} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </span>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
            {error && <p className="text-danger mt-3">{error}</p>}
            {message && <p className="text-success mt-3">{message}</p>}
          </form>

          <div className="text-center mt-3">
            <span>Vous n'avez pas de compte ? </span>
            <a href="/signup" className="blue-link">Inscrivez-vous</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
