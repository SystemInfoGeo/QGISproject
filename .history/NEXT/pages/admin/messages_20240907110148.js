import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des messages', error);
      }
    };

    fetchMessages();
  }, []);

  const handleReply = (message) => {
    setSelectedMessage(message);
  };

  const handleSendReply = async (messageId) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/messages/reply/${messageId}`, {
        reply,
      });
      console.log("Réponse envoyée", response.data);

      // Réinitialiser l'état après l'envoi
      setReply('');
      setSelectedMessage(null);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réponse", error);
    }
  };

  return (
    <AdminLayout>
      <h1>Messages reçus</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Message</th>
            <th>Date reçue</th>
            <th>Action</th> {/* Nouvelle colonne pour l'action de réponse */}
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message.id}>
              <td>{message.id}</td>
              <td>{message.name}</td>
              <td>{message.email}</td>
              <td>{message.message}</td>
              <td>{new Date(message.date_received).toLocaleString()}</td>
              <td>
                <button onClick={() => handleReply(message)}>Répondre</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Si un message est sélectionné pour réponse */}
      {selectedMessage && (
        <div>
          <h4>Répondre à {selectedMessage.name}</h4>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Tapez votre réponse ici"
          />
          <button onClick={() => handleSendReply(selectedMessage.id)}>Envoyer la réponse</button>
        </div>
      )}
    </AdminLayout>
  );
};

export default Messages;
