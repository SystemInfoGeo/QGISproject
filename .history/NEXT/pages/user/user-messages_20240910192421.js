import { useState, useEffect } from 'react';
import axios from 'axios';
import UserLayout from '../../layouts/UserLayout'; // Assurez-vous que ce layout est bien défini

// Composant de chargement
const Loading = () => <p>Chargement des messages...</p>;

// Composant pour afficher un message d'erreur
const ErrorMessage = ({ error }) => <p style={{ color: 'red' }}>Erreur : {error}</p>;

// Composant pour afficher une ligne de message dans le tableau
const MessageRow = ({ message }) => (
  <tr>
    <td>{message.id}</td>
    <td>{message.message}</td>
    <td>{new Date(message.date_received).toLocaleString()}</td>
    <td>{message.reply ? message.reply : 'Pas encore de réponse'}</td>
  </tr>
);

const UserMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);  // État de chargement
  const [error, setError] = useState(null);  // État des erreurs

  useEffect(() => {
    const fetchUserMessages = async () => {
      try {
        // Récupérer l'email de l'utilisateur connecté depuis le localStorage
        const email = localStorage.getItem('userEmail');  

        // Vérification de l'authentification
        if (!email) {
          throw new Error("Utilisateur non authentifié.");
        }

        // Requête API pour récupérer les messages de l'utilisateur
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/messages`, {
          params: { email }
        });

        setMessages(response.data); // Stocker les messages reçus
      } catch (error) {
        console.error('Erreur lors du chargement des messages', error);
        // Gestion des erreurs API ou autres
        if (error.response) {
          setError(error.response.data.error || "Erreur inconnue lors du chargement des messages");
        } else if (error.request) {
          setError("Aucune réponse de l'API");
        } else {
          setError("Erreur dans la requête");
        }
      } finally {
        setLoading(false); // Arrêter le chargement dans tous les cas
      }
    };

    fetchUserMessages(); // Appel de la fonction pour récupérer les messages
  }, []);

  // Si en cours de chargement, afficher le composant de chargement
  if (loading) {
    return (
      <UserLayout>
        <Loading />
      </UserLayout>
    );
  }

  // Si une erreur survient, afficher le composant d'erreur
  if (error) {
    return (
      <UserLayout>
        <ErrorMessage error={error} />
      </UserLayout>
    );
  }

  // Rendu principal, une fois les données chargées et sans erreur
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
              <MessageRow key={message.id} message={message} />
            ))}
          </tbody>
        </table>
      )}
    </UserLayout>
  );
};

export default UserMessages;
