import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('visiteur');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté pour accéder à cette page.');
        return;
      }

      try {
        // Vérifiez si l'utilisateur est connecté et obtenez ses détails
        const response = await axios.get('http://127.0.0.1:5000/check_login', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Vérifiez le rôle de l'utilisateur
        if (response.data.role !== 'admin') {
          setError('Vous n\'avez pas les droits nécessaires pour accéder à cette page.');
          return;
        }

        // Charger la liste des utilisateurs si le rôle est admin
        const usersResponse = await axios.get('http://127.0.0.1:5000/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(usersResponse.data);

      } catch (err) {
        console.error('Erreur lors de la vérification du rôle ou du chargement des utilisateurs', err);
        setError('Erreur lors de la vérification de l\'utilisateur.');
      }
    };

    checkAuth();
  }, [router]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://127.0.0.1:5000/users', {
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        password,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Utilisateur ajouté avec succès');
      setEmail('');
      setFirstName('');
      setLastName('');
      setRole('visiteur');
      setPassword('');
      // Recharger la liste des utilisateurs
      const usersResponse = await axios.get('http://127.0.0.1:5000/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(usersResponse.data);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur', err);
      setError('Erreur lors de l\'ajout de l\'utilisateur');
    }
  };

  return (
    <div>
      <h1>Page d'administration</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleAddUser}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Prénom:</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div>
          <label>Nom:</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div>
          <label>Rôle:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="visiteur">Visiteur</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label>Mot de passe:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Ajouter un utilisateur</button>
      </form>
      <h2>Liste des utilisateurs</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.email} - {user.first_name} {user.last_name} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
