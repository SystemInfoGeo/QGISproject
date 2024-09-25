import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importation de Bootstrap pour le style
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faPhone } from '@fortawesome/free-solid-svg-icons'; // Importer les icônes nécessaires
import '../styles/Signup.css'; // Import du fichier CSS externe

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
      <Navbar /> {/* Inclusion de la Navbar */}

      {/* Contenu principal de la page d'inscription */}
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="signup-container">
          <div className="signup-icon mb-4 mx-auto d-flex justify-content-center align-items-center">
            <FontAwesomeIcon icon={faUser} size="2x" className="text-white" />
          </div>
          <h3 className="text-center mb-4">Inscription</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 position-relative">
              <FontAwesomeIcon icon={faUser} className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control ps-5"
                id="firstName"
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 position-relative">
              <FontAwesomeIcon icon={faUser} className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control ps-5"
                id="lastName"
                placeholder="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 position-relative">
              <FontAwesomeIcon icon={faEnvelope} className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" />
              <input
                type="email"
                className="form-control ps-5"
                id="email"
                placeholder="Adresse Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 position-relative">
              <FontAwesomeIcon icon={faLock} className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" />
              <input
                type="password"
                className="form-control ps-5"
                id="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 position-relative">
              <FontAwesomeIcon icon={faLock} className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" />
              <input
                type="password"
                className="form-control ps-5"
                id="confirmPassword"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 position-relative">
              <FontAwesomeIcon icon={faPhone} className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" />
              <input
                type="tel"
                className="form-control ps-5"
                id="phoneNumber"
                placeholder="Numéro de téléphone"
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
            <span>Vous avez déjà un compte ? </span>
            <a href="/login" className="blue-link">Se connecter</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
