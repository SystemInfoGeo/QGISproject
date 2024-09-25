import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false); // Pour indiquer que la réponse est en cours d'envoi
  const [success, setSuccess] = useState(''); // Pour afficher un message de succès
  const [error, setError] = useState(''); // Pour afficher les erreurs

  // Charger les messages depuis l'API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages`);
        setMessages(response.data);
      } catch (error) {
        setError('Erreur lors du chargement des messages');
        console.error('Erreur lors du chargement des messages', error);
      }
    };

    fetchMessages();
  }, []);

  // Masquer automatiquement les messages d'erreur/succès après 3 secondes
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000); // Efface le message après 3 secondes

      return () => clearTimeout(timer); // Nettoyage du timer
    }
  }, [success, error]);

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
      return; // Annuler si l'utilisateur clique sur "Annuler"
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/messages/reply/${messageId}`, {
        reply,
      });
      setSuccess('Réponse envoyée avec succès');
      console.log("Réponse envoyée", response.data);

      // Mettre à jour l'état pour inclure la réponse dans le message sélectionné
      setMessages((prevMessages) => 
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, reply, reply_date: new Date().toISOString() } : msg
        )
      );

      // Réinitialiser l'état après l'envoi
      setReply('');
      setSelectedMessage(null);
    } catch (error) {
      setError("Erreur lors de l'envoi de la réponse");
      console.error("Erreur lors de l'envoi de la réponse", error);
    } finally {
      setLoading(false); // Désactiver le chargement
    }
  };

  return (
    <AdminLayout>
      <h1>Messages reçus</h1>

      {/* Affichage des messages de succès ou d'erreur */}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Message</th>
            <th>Réponse</th>
            <th>Date de réponse</th> {/* Nouvelle colonne pour afficher la date de réponse */}
            <th>Date reçue</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message.id}>
              <td>{message.id}</td>
              <td>{message.name}</td>
              <td>{message.email}</td>
              <td>{message.message}</td>
              <td>{message.reply || 'Pas encore de réponse'}</td>
              <td>{message.reply_date ? new Date(message.reply_date).toLocaleString() : 'Pas encore de réponse'}</td> {/* Afficher la date de réponse */}
              <td>{new Date(message.date_received).toLocaleString()}</td>
              <td>
                <button onClick={() => handleReply(message)}>Répondre</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulaire de réponse si un message est sélectionné */}
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
            disabled={loading} // Désactiver uniquement si en cours d'envoi
            style={{ backgroundColor: loading ? 'gray' : 'blue', color: 'white' }}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer la réponse'}
          </button>
        </div>
      )}
    </AdminLayout>
  );
};

export default Messages;
