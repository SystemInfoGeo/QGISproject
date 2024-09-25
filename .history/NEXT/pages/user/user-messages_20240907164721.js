import { useState, useEffect } from 'react';
import axios from 'axios';
import UserLayout from '../../layouts/UserLayout'; // Assurez-vous d'avoir un layout utilisateur

const UserMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);  // Pour gérer l'état de chargement
  const [error, setError] = useState(null);  // Pour gérer les erreurs

  useEffect(() => {
    const fetchUserMessages = async () => {
      try {
        // Récupérer l'email de l'utilisateur connecté depuis le localStorage
        const email = localStorage.getItem('userEmail');  

        // Assurez-vous que l'email est bien récupéré
        if (!email) {
          throw new Error("Utilisateur non authentifié.");
        }

        // Requête API pour récupérer les messages de l'utilisateur
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/messages`, {
          params: { email }
        });

        setMessages(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des messages', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMessages();
  }, []);

  // Affichage de l'état de chargement ou des erreurs
  if (loading) {
    return <UserLayout><p>Chargement des messages...</p></UserLayout>;
  }

  if (error) {
    return <UserLayout><p>Erreur : {error}</p></UserLayout>;
  }

  return (
    <UserLayout>
      <h1>Mes messages</h1>
      {messages.length === 0 ? (
        <p>Aucun message reçu pour le moment.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Message</th>
              <th>Date envoyée</th>
              <th>Réponse de l'administrateur</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td>{message.id}</td>
                <td>{message.message}</td>
                <td>{new Date(message.date_received).toLocaleString()}</td>
                <td>{message.reply ? message.reply : 'Pas encore de réponse'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </UserLayout>
  );
};

export default UserMessages;
