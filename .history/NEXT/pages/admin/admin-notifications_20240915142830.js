import { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token'); // Assurez-vous que le token JWT est présent
      if (!token) {
        setError('Veuillez vous reconnecter.');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:5000/admin/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(response.data.notifications);
      } catch (err) {
        setError('Erreur lors de la récupération des notifications.');
        console.error(err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <Head>
        <title>Notifications Admin</title>
      </Head>
      <h1>Notifications</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li key={notification.id}>
              {notification.message} - {new Date(notification.timestamp).toLocaleString()}
            </li>
          ))
        ) : (
          <p>Aucune notification à afficher.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminNotifications;
