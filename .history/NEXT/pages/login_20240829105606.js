import { useState } from 'react'; // Importation de useState pour gérer l'état local du composant
import axios from 'axios'; // Importation d'axios pour effectuer des requêtes HTTP
import { useRouter } from 'next/router'; // Importation de useRouter pour la redirection
import 'bootstrap/dist/css/bootstrap.min.css'; // Importation de Bootstrap pour le style

const Login = () => {
  // Déclaration des états locaux pour stocker l'email, le mot de passe, les erreurs et l'état de chargement
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Utilisation du hook useRouter pour gérer la navigation

  // Fonction qui est déclenchée lors de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêcher le comportement par défaut du formulaire (rechargement de la page)
    setError(''); // Réinitialiser les erreurs à chaque soumission
    setLoading(true); // Indiquer que la soumission est en cours

    // Validation simple pour vérifier si les champs email et password sont remplis
    if (!email || !password) {
      setError('Tous les champs sont requis.');
      setLoading(false); // Arrêter le chargement si la validation échoue
      return;
    }

    try {
      // Envoi d'une requête POST au serveur Flask pour tenter de se connecter
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, { email, password });
      localStorage.setItem('token', response.data.token); // Stockage du token de session dans le localStorage
      router.push('/collect'); // Redirection vers la page de collecte après une connexion réussie
    } catch (error) {
      // Gestion des différentes erreurs en fonction du code de statut de la réponse
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
      setLoading(false); // Arrêter l'indicateur de chargement après la tentative de connexion
    }
  };

  return (
    <>
      {/* Barre de navigation avec Bootstrap */}
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#808080' }}> {/* Couleur gris */}
        <div className="container-fluid">
          <a className="navbar-brand" href="/" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
            {/* Ajout du logo de l'application dans la barre de navigation */}
            <img src="/images/logo.jpg" alt="Logo" style={{ width: '40px', height: '40px', marginRight: '15px' }} />
            Clean Zone
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Liens de navigation dans la barre */}
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/" style={{ color: 'white', marginRight: '15px' }}>Accueil</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about" style={{ color: 'white', marginRight: '15px' }}>À propos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/map" style={{ color: 'white', marginRight: '15px' }}>Carte</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact" style={{ color: 'white', marginRight: '15px' }}>Contact</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/signup" style={{ color: 'white' }}>S'inscrire</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Contenu principal de la page de connexion */}
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        {/* Style CSS en ligne spécifique à ce composant */}
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

        {/* Formulaire de connexion */}
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

export default Login; // Exportation du composant Login pour l'utiliser dans d'autres parties de l'application
