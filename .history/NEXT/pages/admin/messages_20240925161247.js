import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Container, Row, Col } from 'react-bootstrap';
import AdminLayout from '../../layouts/AdminLayout';

const Messages = () => {
  const [messages, setMessages] = useState([]); // Initialisation des messages
  const [selectedMessage, setSelectedMessage] = useState(null); // Message sélectionné pour réponse
  const [reply, setReply] = useState(''); // Réponse à envoyer
  const [loading, setLoading] = useState(false); // Chargement en cours
  const [loadingMessages, setLoadingMessages] = useState(false); // Chargement des messages
  const [success, setSuccess] = useState(''); // Message de succès
  const [error, setError] = useState(''); // Message d'erreur

  useEffect(() => {
    // Fonction pour récupérer les messages depuis l'API Flask
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token'); // Récupérer le token JWT
        const response = await axios.get('http://127.0.0.1:5000/messages', {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });

        console.log(" response.data ", response.data
        )
        setMessages(response.data.messages);  // Stocker les messages
        setLoading(false); // Arrêter le chargement
      } catch (err) {
        setError('Erreur lors du chargement des messages');
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <p>Chargement des messages...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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
            <th>Date de réponse</th>
          </tr>
        </thead>
        <tbody>
          {messages.length > 0 ? (
            messages.message.map(message => (
              <tr key={message.id}>
                <td>{message.id}</td>
                <td>{message.name}</td>
                <td>{message.email}</td>
                <td>{message.message}</td>
                <td>{new Date(message.date_received).toLocaleString()}</td>
                <td>{message.reply || 'Pas encore de réponse'}</td>
                <td>{message.reply_date ? new Date(message.reply_date).toLocaleString() : 'Pas encore de réponse'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Aucun message trouvé</td>
            </tr>
          )}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default Messages;

  // Charger les messages depuis l'API
  /*useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('token'); // Récupérer le token JWT
      //  Vérifier si le token est bien récupéré
      console.log("Token JWT:", token);
      if (!token) {
        setError('Token manquant. Veuillez vous reconnecter.');
        return;
      }

      setLoadingMessages(true); // Activer l'indicateur de chargement des messages

      try {
        const response = await axios.get(`http://127.0.0.1:5000/messages`, {
          headers: {                      
            Authorization: `Bearer ${token}`, // Ajouter le token JWT dans les en-têtes
          },
        });

        console.log("Réponse complète de l'API :", response.data);

        // Vérifiez si les données reçues sont bien un tableau
        if (response.data && response.data.messages && Array.isArray(response.data.messages)) {
          setMessages(response.data.messages); // Définir les messages
        } else {
          setMessages([]); // Si ce n'est pas un tableau, définir un tableau vide
        }

      } catch (error) {
        setError('Erreur lors du chargement des messages.');
        console.error('Erreur lors du chargement des messages:', error);
      } finally {
        setLoadingMessages(false); // Désactiver le chargement des messages
      }
    };

    fetchMessages();
  }, []);*/
  
/*
  // Fonction pour sélectionner un message pour y répondre
  const handleReply = (message) => {
    setSelectedMessage(message); // Définir le message sélectionné
    setReply(''); // Réinitialiser le champ de réponse
  };

  // Fonction pour envoyer la réponse
  const handleSendReply = async (messageId) => {
    if (!reply.trim()) {
      setError('Veuillez saisir une réponse avant de l\'envoyer.');
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir envoyer cette réponse ?')) {
      return; // Si l'utilisateur clique sur "Annuler"
    }

    setLoading(true); // Indicateur de chargement
    setError(''); // Réinitialiser l'erreur
    setSuccess(''); // Réinitialiser le succès

    const token = localStorage.getItem('token'); // Récupérer le token JWT

    try {
      const response = await axios.post(`http://127.0.0.1:5000/messages/reply/${messageId}`, {
        reply,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token JWT dans les en-têtes
        },
      });

      setSuccess('Réponse envoyée avec succès');
      console.log("Réponse envoyée:", response.data);

      // Mettre à jour les messages dans l'état local
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, reply, reply_date: new Date().toISOString() } : msg
        )
      );

      setReply(''); // Réinitialiser le champ de réponse
      setSelectedMessage(null); // Réinitialiser le message sélectionné
    } catch (error) {
      setError("Erreur lors de l'envoi de la réponse.");
      console.error("Erreur lors de l'envoi de la réponse:", error);
    } finally {
      setLoading(false); // Désactiver l'indicateur de chargement
    }
  };
    
export default Messages;*/