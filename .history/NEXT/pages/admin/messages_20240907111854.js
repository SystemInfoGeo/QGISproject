import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);  // Message sélectionné
  const [replyContent, setReplyContent] = useState('');  // Contenu de la réponse

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

  // Fonction pour envoyer la réponse
  const sendReply = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/messages/reply/${selectedMessage.id}`, {
        reply: replyContent,
      });
      alert('Réponse enregistrée avec succès');
      // Mettre à jour la liste des messages après avoir envoyé la réponse
      setMessages(messages.map(msg => 
        msg.id === selectedMessage.id ? { ...msg, reply: replyContent } : msg
      ));
      setReplyContent('');  // Vider le champ après l'envoi de la réponse
      setSelectedMessage(null);  // Désélectionner le message après envoi
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse', error);
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
            <th>Réponse</th>
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
              <td>{new Date(message.date_received).toLocaleString()}</td>
              <td>{message.reply ? message.reply : 'Aucune réponse pour le moment'}</td>
              <td>
                <button onClick={() => setSelectedMessage(message)}>Répondre</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Affichage du formulaire de réponse si un message est sélectionné */}
      {selectedMessage && (
        <div>
          <h2>Répondre à {selectedMessage.name}</h2>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows="4"
            cols="50"
          />
          <button onClick={sendReply}>Envoyer la réponse</button>
        </div>
      )}
    </AdminLayout>
  );
};

export default Messages;
