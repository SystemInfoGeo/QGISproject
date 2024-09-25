import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('agent');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Fonction pour charger les utilisateurs
  const loadUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Fonction pour ajouter un utilisateur
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users', { email, firstName, lastName, role, password });
      setMessage('Utilisateur ajouté avec succès');
      loadUsers();
    } catch (error) {
      setError('Erreur lors de l\'ajout de l\'utilisateur');
      console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
    }
  };

  // Fonction pour modifier un utilisateur
  const handleUpdateUser = async (id) => {
    try {
      const response = await axios.put(`/users/${id}`, { email, firstName, lastName, role });
      setMessage('Utilisateur modifié avec succès');
      loadUsers();
    } catch (error) {
      setError('Erreur lors de la modification de l\'utilisateur');
      console.error('Erreur lors de la modification de l\'utilisateur', error);
    }
  };

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = async (id) => {
    try {
      const response = await axios.delete(`/users/${id}`);
      setMessage('Utilisateur supprimé avec succès');
      loadUsers();
    } catch (error) {
      setError('Erreur lors de la suppression de l\'utilisateur');
      console.error('Erreur lors de la suppression de l\'utilisateur', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1>Administration des utilisateurs</h1>
        
        {error && <p className="text-danger">{error}</p>}
        {message && <p className="text-success">{message}</p>}

        <form onSubmit={handleAddUser}>
          <h2>Ajouter un utilisateur</h2>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Prénom</label>
            <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Nom</label>
            <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Rôle</label>
            <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="agent">Agent</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Ajouter</button>
        </form>

        <h2 className="mt-5">Liste des utilisateurs</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.role}</td>
                <td>
                  <button className="btn btn-info me-2" onClick={() => handleUpdateUser(user.id)}>Modifier</button>
                  <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminPage;
