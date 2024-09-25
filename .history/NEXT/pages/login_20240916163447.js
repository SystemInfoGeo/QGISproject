import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons'; // Import icons

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

  const inputStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #ced4da',
    borderLeft: '0',
    borderRadius: '0',
    width: '95%', // Assure que la largeur des champs est 100% du conteneur
    boxSizing: 'border-box' // Inclut les bordures et le padding dans la largeur
  };

  const inputFocusStyle = {
    backgroundColor: '#ffffff',
    borderColor: '#007bff',
    boxShadow: '0 0 0 0.2rem rgba(38, 143, 255, 0.25)',
  };

  return (
    <>
      <Navbar />

      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          maxWidth: '600px',
          width: '100%'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#28a745',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 20px'
          }}>
            <FontAwesomeIcon icon={faUser} size="2x" style={{ color: 'white' }} />
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
                  style={inputStyle}
                  onFocus={(e) => e.target.style = { ...inputStyle, ...inputFocusStyle }}
                  onBlur={(e) => e.target.style = inputStyle}
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
                  style={inputStyle}
                  onFocus={(e) => e.target.style = { ...inputStyle, ...inputFocusStyle }}
                  onBlur={(e) => e.target.style = inputStyle}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success w-100" style={{ backgroundColor: '#28a745', color: 'white', marginTop: '20px' }} disabled={loading}>
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
