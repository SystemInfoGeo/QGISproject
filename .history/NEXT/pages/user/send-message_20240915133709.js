import { useState } from 'react';
import axios from 'axios';

const SendMessage = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setLoading(true); // Démarrer le chargement

    const token = localStorage.getItem('token');
    if (!token || token.trim() === '') {
      setError('Token JWT manquant ou invalide. Veuillez vous reconnecter.');
      setLoading(false); // Arrêter le chargement
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/user/send-message', 
        { message }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Message envoyé et notification créée.');
      setMessage(''); // Vider le champ après l'envoi
      setError(''); // Réinitialiser l'erreur s'il y en avait
    } catch (err) {
      // Gestion des erreurs serveur
      const errorMessage = err.response ? err.response.data.error : 'Erreur inconnue';
      setError(`Erreur lors de l'envoi du message: ${errorMessage}`);
      console.error(err.response ? err.response.data : err.message);
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

  return (
    <div>
      <h1>Envoyer un message</h1>
      <form onSubmit={handleSendMessage}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Entrez votre message"
          rows="4"
          cols="50"
          required // Ajouté pour rendre le champ obligatoire
        ></textarea>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </form>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SendMessage;
