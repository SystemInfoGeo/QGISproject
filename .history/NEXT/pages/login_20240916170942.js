import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../styles/Login.css'; // Import du fichier CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // État pour afficher ou masquer le mot de passe
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
      const { access_token, role } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);
      login(access_token);
      setMessage('Connexion réussie');
      if (role === 'admin') {
        router.push('/admin/profile');
      } else {
        router.push('/user/profile');
      }
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

  // Fonction pour basculer la visibilité du mot de passe
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
                  type={showPassword ? "text" : "password"} // Bascule entre texte et mot de passe
                  id="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-control"
                />
                <div className="input-group-append">
                  <span className="input-group-text" onClick={toggleShowPassword} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> {/* Icône de l'œil */}
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
            <p>Vous n'avez pas de compte ? <a href="/signup">Inscrivez-vous</a></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
