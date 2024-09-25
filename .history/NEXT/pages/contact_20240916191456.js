import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importer Bootstrap pour le style
import { useRouter } from 'next/router'; // Importer useRouter pour détecter la route actuelle
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons'; // Importer les icônes nécessaires
import '../styles/Contact.css'; // Importer le fichier CSS externe

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter(); // Utiliser useRouter pour obtenir la route actuelle

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(`http://127.0.0.1:5000/messages`, {
        name,
        email,
        message,
      });

      if (response.status === 200) {
        setSuccess('Votre message a été envoyé avec succès.');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      setError("Erreur lors de l'envoi du message. Veuillez vérifier votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar /> {/* Inclusion de la Navbar */}

      {/* Style personnalisé pour la page Contact */}
      <div className="contact-container d-flex justify-content-center align-items-center vh-100">
        <div className="contact-form shadow-lg p-4 rounded">
          <div className="row">
            {/* Formulaire à gauche */}
            <div className="col-md-8">
              <h2 className="mb-4 text-center">Contactez-nous</h2>
              <form onSubmit={handleSubmit}>
                {/* Champ Nom avec icône */}
                <div className="mb-3 input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faUser} /> {/* Icône de l'utilisateur */}
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Champ Email avec icône */}
                <div className="mb-3 input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faEnvelope} /> {/* Icône de l'enveloppe */}
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Champ Message */}
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                  {loading ? 'Envoi en cours...' : 'Envoyer'}
                </button>
                {error && <p className="text-danger mt-3">{error}</p>}
                {success && <p className="text-success mt-3">{success}</p>}
              </form>
            </div>

            {/* Image à droite */}
            <div className="col-md-4 d-flex flex-column align-items-center justify-content-center">
              <img src="/images/contact-illustration.png" alt="Contact Illustration" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
