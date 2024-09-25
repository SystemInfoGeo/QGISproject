import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

const Messages = () => {
  const [messages, setMessages] = useState([]); // Initialisation des messages comme tableau
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false); // Pour charger les messages
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Charger les messages depuis l'API
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('token'); // Récupérer le token JWT
      if (!token) {
        setError('Token manquant. Veuillez vous reconnecter.');
        return;
      }

      setLoadingMessages(true); // Activer le chargement des messages

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
          headers: {
            Authorization: `Bearer ${token}` // Ajouter le token JWT dans les en-têtes
          }
        });

        if (Array.isArray(response.data)) {
          setMessages(response.data); // Définir les messages si c'est un tableau
        } else {
          setMessages([]); // Si la réponse n'est pas un tableau, définissez un tableau vide
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Erreur d\'authentification. Veuillez vous reconnecter.');
        } else {
          setError('Erreur lors du chargement des messages');
        }
        console.error('Erreur lors du chargement des messages', error);
      } finally {
        setLoadingMessages(false); // Désactiver le chargement des messages
      }
    };

    fetchMessages();
  }, []);

  // Sélectionner un message pour répondre
  const handleReply = (message) => {
    setSelectedMessage(message);
    setReply(''); // Réinitialiser le champ de réponse
  };

  // Envoyer la réponse
  const handleSendReply = async (messageId) => {
    if (!reply.trim()) {
      setError('Veuillez saisir une réponse avant de l\'envoyer.');
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir envoyer cette réponse ?')) {
      return; // Si l'utilisateur clique sur "Annuler"
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token'); // Récupérer le token JWT

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/messages/reply/${messageId}`, {
        reply,
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Ajouter le token JWT dans les en-têtes
        }
      });
      setSuccess('Réponse envoyée avec succès');
      console.log("Réponse envoyée", response.data);

      // Mettre à jour l'état pour inclure la réponse dans le message sélectionné
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, reply, reply_date: new Date().toISOString() } : msg
        )
      );

      setReply('');
      setSelectedMessage(null);
    } catch (error) {
      setError("Erreur lors de l'envoi de la réponse");
      console.error("Erreur lors de l'envoi de la réponse", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1>Messages reçus</h1>

      {/* Affichage des messages de succès ou d'erreur */}
      {loadingMessages ? (
        <p>Chargement des messages...</p>
      ) : (
        <>
          {success && <p style={{ color: 'green' }}>{success}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date reçue</th>
                <th>Réponse</th>
                <th>Date de réponse</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <tr key={message.id}>
                    <td>{message.id}</td>
                    <td>{message.name}</td>
                    <td>{message.email}</td>
                    <td>{message.message}</td>
                    <td>{new Date(message.date_received).toLocaleString()}</td>
                    <td>{message.reply || 'Pas encore de réponse'}</td>
                    <td>{message.reply_date ? new Date(message.reply_date).toLocaleString() : 'Pas encore de réponse'}</td>
                    <td>
                      <button onClick={() => handleReply(message)}>Répondre</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">Aucun message trouvé</td>
                </tr>
              )}
            </tbody>
          </table>

          {selectedMessage && (
            <div>
              <h4>Répondre à {selectedMessage.name}</h4>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Tapez votre réponse ici"
                rows="4"
                style={{ width: '100%', marginBottom: '10px' }}
              />
              <button
                onClick={() => handleSendReply(selectedMessage.id)}
                disabled={loading}
                style={{ backgroundColor: loading ? 'gray' : 'blue', color: 'white' }}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer la réponse'}
              </button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default Messages;