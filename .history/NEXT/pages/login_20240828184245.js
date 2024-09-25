import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation basique
    if (!email || !password) {
      setError('Tous les champs sont requis.');
      setLoading(false);
      return;
    }

    try {
      // Envoyer la requête au serveur Flask
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, { email, password });
      
      // Stocker le token de session dans le localStorage
      localStorage.setItem('token', response.data.token);
      
      // Rediriger vers la page de collecte après une connexion réussie
      router.push('/collect');
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
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">Nom de l'Application</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">Accueil</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/signup">S'inscrire</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

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
            <img src="https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png" alt="User Icon" />
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
            <div className="form-check mb-3">
              <input type="checkbox" className="form-check-input" id="remember" />
              <label className="form-check-label" htmlFor="remember">Se souvenir de moi</label>
            </div>
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
            {error && <p className="text-danger mt-3">{error}</p>}
          </form>
          <div className="text-center mt-3">
            <a href="#">Mot de passe oublié ?</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
