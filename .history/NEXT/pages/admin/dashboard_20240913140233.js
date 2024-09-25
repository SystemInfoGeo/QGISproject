import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { FaUsers, FaEnvelope, FaUserPlus, FaUserCheck } from 'react-icons/fa';

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [pendingMessages, setPendingMessages] = useState(0);

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
    <AdminLayout>
      <div className="container mt-5">
        <h1 className="mb-4">Tableau de bord Administrateur</h1>
        <div className="row">
          <div className="col-md-3">
            <div className="dashboard-card bg-primary text-white">
              <div className="card-body">
                <FaUsers size={40} />
                <h5 className="card-title mt-2">Total Utilisateurs</h5>
                <p className="card-text">{totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="dashboard-card bg-success text-white">
              <div className="card-body">
                <FaUserCheck size={40} />
                <h5 className="card-title mt-2">Utilisateurs Actifs</h5>
                <p className="card-text">{activeUsers}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="dashboard-card bg-warning text-white">
              <div className="card-body">
                <FaUserPlus size={40} />
                <h5 className="card-title mt-2">Nouveaux Utilisateurs (7 jours)</h5>
                <p className="card-text">{newUsers}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="dashboard-card bg-danger text-white">
              <div className="card-body">
                <FaEnvelope size={40} />
                <h5 className="card-title mt-2">Messages Reçus</h5>
                <p className="card-text">{totalMessages}</p>
                <p>En attente de réponse : {pendingMessages}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-card {
          height: 180px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 15px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }

        .dashboard-card:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .card-body {
          text-align: center;
        }

        .card-title {
          font-size: 1.2rem;
        }

        .card-text {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .row {
          gap: 20px; /* Ajouter un espacement entre les boîtes */
        }
      `}</style>
    </AdminLayout>
  );
}
