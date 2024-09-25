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
      // Envoi des données à l'API Flask
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
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src="/images/logo.jpg" alt="Logo" width={40} height={40} className="me-3" />
            Clean Zone
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">Accueil</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about">À propos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/map">Carte</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact">Contact</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/signup">S'inscrire</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Formulaire de contact */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white text-center">
                <h2>Contactez-nous</h2>
              </div>
              <div className="card-body">
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
                    <label htmlFor="email" className="form-label">Adresse Email</label>
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
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Envoi en cours...' : 'Envoyer'}
                  </button>
                  {error && <p className="text-danger mt-3">{error}</p>}
                  {success && <p className="text-success mt-3">{success}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;

