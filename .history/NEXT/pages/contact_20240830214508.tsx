import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importer Bootstrap pour le style

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
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
      setError('Erreur lors de l\'envoi du message. Veuillez vérifier votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Barre de navigation */}
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#808080' }}>
        <div className="container-fluid">
          <a className="navbar-brand" href="/" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
            <img src="/images/logo.jpg" alt="Logo" style={{ width: '40px', height: '40px', marginRight: '15px' }} />
            Clean Zone
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
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
            </ul>
          </div>
        </div>
      </nav>

      {/* Style personnalisé pour la page Contact */}
      <div className="contact-container d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f4f4f4' }}>
        <div className="contact-form shadow-lg p-4 rounded" style={{ backgroundColor: '#1a2e4e', color: 'white', maxWidth: '900px', width: '100%' }}>
          <div className="row">
            {/* Formulaire à droite */}
            <div className="col-md-8">
              <h2 className="mb-4 text-center">Contactez-nous</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nom</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
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
                <button type="submit" className="btn btn-success w-100" disabled={loading} style={{ color: 'white', backgroundColor: '#28a745' }}>
                  {loading ? 'Envoi en cours...' : 'Envoyer'}
                </button>
                {error && <p className="text-danger mt-3">{error}</p>}
                {success && <p className="text-success mt-3">{success}</p>}
              </form>
            </div>
            {/* Image à gauche */}
            <div className="col-md-4 d-flex flex-column align-items-center justify-content-center">
              <img src="/images/contact-illustration.png" alt="Contact Illustration" style={{ width: '100%', height: 'auto' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;

