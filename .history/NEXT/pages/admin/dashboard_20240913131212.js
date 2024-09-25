import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [pendingMessages, setPendingMessages] = useState(0);

  // Appels API pour récupérer les données du tableau de bord
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const totalUsersRes = await axios.get('http://localhost:5000/total-users');
        setTotalUsers(totalUsersRes.data.total_users);

        const activeUsersRes = await axios.get('http://localhost:5000/active-users');
        setActiveUsers(activeUsersRes.data.active_users);

        const newUsersRes = await axios.get('http://localhost:5000/new-users');
        setNewUsers(newUsersRes.data.new_users);

        const messagesRes = await axios.get('http://localhost:5000/messages');
        setTotalMessages(messagesRes.data.total_messages);
        setPendingMessages(messagesRes.data.pending_messages);
      } catch (error) {
        console.error('Erreur lors du chargement des données du tableau de bord', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>  {/* Utilisation du layout Admin */}
      <div className="container mt-5">
        <h1>Tableau de bord Administrateur</h1>
        <div className="row">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Total Utilisateurs</h5>
                <p className="card-text">{totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Utilisateurs Actifs</h5>
                <p className="card-text">{activeUsers}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Nouveaux Utilisateurs (7 jours)</h5>
                <p className="card-text">{newUsers}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Messages Reçus</h5>
                <p className="card-text">{totalMessages}</p>
                <p>En attente de réponse : {pendingMessages}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
