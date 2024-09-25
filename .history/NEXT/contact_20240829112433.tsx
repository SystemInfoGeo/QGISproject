import { useState } from 'react';
import axios from 'axios';

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
    <div className="container mt-5">
      <h1>Contactez-nous</h1>
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
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Envoi en cours...' : 'Envoyer'}
        </button>
        {error && <p className="text-danger mt-3">{error}</p>}
        {success && <p className="text-success mt-3">{success}</p>}
      </form>
    </div>
  );
};

export default Contact;
