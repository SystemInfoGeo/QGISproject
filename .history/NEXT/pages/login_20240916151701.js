import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';  
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';  // Import des icônes

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
            max-width: 600px;
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
            margin-top: 20px;
          }
          .input-group {
            position: relative;
          }
          .form-control {
            background-color: #e9f5ff;
            border: 1px solid #ced4da;
            border-radius: 8px;
            padding-left: 40px; /* Laisse de la place pour l'icône */
          }
          .form-control:focus {
            background-color: #ffffff;
            border-color: #80bdff;
            outline: 0;
            box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
          }
          .form-control::placeholder {
            color: #6c757d;
          }
          .form-control:focus::placeholder {
            color: #495057;
          }
          .input-icon {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #6c757d;
          }
        `}</style>

        <div className="login-container">
          <div className="login-icon mb-4 mx-auto d-flex justify-content-center align-items-center">
            <FontAwesomeIcon icon={faUser} size="2x" className="text-white" />
          </div>
          <h3 className="text-center mb-4">Connexion</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Adresse Email</label>
              <div className="input-group">
                <span className="input-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
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
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <div className="input-group">
                <span className="input-icon">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}  
                  className="form-control"
                  id="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success w-100 login-btn" disabled={loading}>
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
