import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

const Messages = () => {
  const [messages, setMessages] = useState([]);

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
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default Messages;
