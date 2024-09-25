import { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://127.0.0.1:5000/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id}>
            {notification.message} - {new Date(notification.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
