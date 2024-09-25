import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        setError('Erreur lors du chargement des utilisateurs');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Liste des Utilisateurs</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.first_name} {user.last_name} ({user.role}) - {user.email}
            {/* Vous pouvez ajouter ici des boutons pour éditer ou supprimer */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsers;
