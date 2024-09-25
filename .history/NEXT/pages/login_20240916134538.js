import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';  
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);  // État pour basculer l'affichage du mot de passe
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
          .login-icon svg {
            width: 30px;
            height: 30px;
          }
          .login-btn {
            background-color: #28a745;
            color: white;
          }
          .input-group {
            position: relative;
          }
          .form-control {
            background-color: #e9f5ff;
            padding-right: 40px;  /* Laisser de l'espace pour l'icône à droite */
            border-radius: 8px;  /* Arrondir les coins */
            border: 1px solid #ced4da;
          }
          .toggle-password {
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            cursor: pointer;
            color: #6c757d;
          }
          .form-label {
            font-weight: bold;
            margin-bottom: 8px;
          }
        `}</style>

        <div className="login-container">
          <div className="login-icon mb-4 mx-auto d-flex justify-content-center align-items-center">
            <FontAwesomeIcon icon={faUser} size="2x" className="text-white" />
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
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}  
                  className="form-control"
                  id="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="toggle-password">
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
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
