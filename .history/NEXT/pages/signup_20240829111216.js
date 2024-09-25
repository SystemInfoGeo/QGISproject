import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importation de Bootstrap pour le style

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Adresse email invalide.');
      setLoading(false);
      return;
    }

    const phonePattern = /^[0-9]{10,15}$/;
    if (!phonePattern.test(phoneNumber)) {
      setError('Numéro de téléphone invalide.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
        email,
        password,
        confirm_password: confirmPassword,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber
      });

      if (response.status === 201) {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
        setPhoneNumber('');

        router.push('/login');
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
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
                <a className="nav-link" href="/" style={{ color: 'white', marginRight: '30px' }}>Accueil</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about" style={{ color: 'white', marginRight: '30px' }}>À propos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/map" style={{ color: 'white', marginRight: '30px' }}>Carte</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact" style={{ color: 'white', marginRight: '30px' }}>Contact</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/signup" style={{ color: 'white', marginRight: '30px' }}>S'inscrire</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/login" style={{ color: 'white' }}>Se connecter</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Contenu principal de la page d'inscription */}
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        {/* Style CSS en ligne spécifique à ce composant */}
        <style jsx>{`
          .signup-container {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            max-width: 400px;
            width: 100%;
          }
          .signup-icon {
            width: 60px;
            height: 60px;
            background-color: #28a745;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 20px;
          }
          .signup-icon img {
            width: 30px;
          }
          .signup-btn {
            background-color: #28a745;
            color: white;
          }
        `}</style>

        {/* Formulaire d'inscription */}
        <div className="signup-container">
          <div className="signup-icon mb-4 mx-auto d-flex justify-content-center align-items-center">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png" alt="User Icon" />
          </div>
          <h3 className="text-center mb-4">S'inscrire</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">Prénom</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                placeholder="Entrez votre prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Nom</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                placeholder="Entrez votre nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
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
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirmez votre mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">Numéro de téléphone</label>
              <input
                type="tel"
                className="form-control"
                id="phoneNumber"
                placeholder="Entrez votre numéro de téléphone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100 signup-btn" disabled={loading}>
              {loading ? 'Inscription en cours...' : "S'inscrire"}
            </button>
            {error && <p className="text-danger mt-3">{error}</p>}
          </form>
          <div className="text-center mt-3">
            <a href="/login">Vous avez déjà un compte ? Se connecter</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
