// SendNotification.js
import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

const SendNotification = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Supposons que vous avez un moyen de récupérer l'userId (par exemple, stocké dans le localStorage ou fourni par le backend)
  const userId = localStorage.getItem('userId'); // Assurez-vous que l'userId est bien récupéré

  const handleSendNotification = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Assurez-vous que le token JWT est présent
    if (!token) {
      setError('Veuillez vous reconnecter.');
      return;
    }

    if (!userId || !message) {
      setError('L\'identifiant de l\'utilisateur et le message sont obligatoires.');
      return;
    }

    try {
      // Envoyer la requête POST à votre API Flask
      const response = await axios.post(
        'http://127.0.0.1:5000/user/send-notification',
        {
          user_id: userId,  // Assurez-vous que cette valeur est correcte
          message: message  // Assurez-vous que le message est fourni
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // Ajout du token JWT dans les en-têtes
          }
        }
      );

      console.log(response.data);
      setSuccess('Notification envoyée avec succès.');
      setMessage(''); // Vider le champ après l'envoi
      setError(''); // Réinitialiser les erreurs
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
