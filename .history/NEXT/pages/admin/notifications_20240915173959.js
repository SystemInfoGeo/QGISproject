import { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';  // N'oubliez pas d'importer Bootstrap pour le style
import AdminLayout from '../../layouts/AdminLayout';

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
        const response = await axios.get('http://127.0.0.1:5000/admin/get-notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des notifications.');
        console.error(err);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.post(`http://127.0.0.1:5000/admin/mark-as-read/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la notification.', err);
    }
  };

  const handleDeleteNotification = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`http://127.0.0.1:5000/admin/delete-notification/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression de la notification.', err);
    }
  };

  return (
    <AdminLayout>
    <div className="container mt-5">
      <Head>
        <title>Notifications Admin</title>
      </Head>
      <h1 className="mb-4">Notifications</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {notifications.length > 0 ? (
        <div className="row">
          {notifications.map((notification) => (
            <div className="col-md-4 mb-4" key={notification.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-bell"></i> Notification
                  </h5>
                  <p className="card-text">{notification.message}</p>
                  <p className="text-muted">
                    <small>Envoyé le {new Date(notification.timestamp).toLocaleString()}</small>
                  </p>
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary btn-sm" onClick={() => handleMarkAsRead(notification.id)}>
                    Marquer comme lu
                  </button>
                  <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDeleteNotification(notification.id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune notification à afficher.</p>
      )}
    </div>
    </AdminLayout> 
  );
};

export default AdminNotifications;
