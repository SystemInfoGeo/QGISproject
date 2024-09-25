import { useState } from 'react';
import axios from 'axios';

const SendMessage = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Le token JWT doit être présent
    if (!token) {
      setError('Veuillez vous reconnecter.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/user/send-message', 
        { message }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Message envoyé et notification créée.');
      setMessage(''); // Vider le champ après l'envoi
    } catch (err) {
      setError('Erreur lors de l\'envoi du message.');
      console.error(err);
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
        ></textarea>
        <br />
        <button type="submit">Envoyer</button>
      </form>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SendMessage;
