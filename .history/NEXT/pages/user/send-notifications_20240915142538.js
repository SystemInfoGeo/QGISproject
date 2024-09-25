import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';

const SendNotification = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSendNotification = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Assurez-vous que le token JWT est présent
    if (!token) {
      setError('Veuillez vous reconnecter.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/user/send-notification', 
        { message }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Notification envoyée avec succès.');
      setMessage(''); // Vider le champ après l'envoi
    } catch (err) {
      setError('Erreur lors de l\'envoi de la notification.');
      console.error(err);
    }
  };

  return (
    <div>
      <Head>
        <title>Envoyer une Notification</title>
      </Head>
      <h1>Envoyer une notification</h1>
      <form onSubmit={handleSendNotification}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Entrez votre notification"
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

export default SendNotification;
