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
    // Vérifiez si l'utilisateur est connecté
    axios.get('/check_login')
      .then(response => {
        if (!response.data.logged_in) {
          router.push('/login');
        }
      })
      .catch(err => {
        console.error('Erreur de vérification de connexion:', err);
        router.push('/login');
      });
  }, [router]);

  useEffect(() => {
    // Charger la liste des utilisateurs
    const token = localStorage.getItem('token');  // Récupérer le jeton JWT
    axios.get('http://127.0.0.1:5000/users', {
      headers: {
        Authorization: `Bearer ${token}`  // Ajouter le jeton aux en-têtes
      }
    })
      .then(response => setUsers(response.data))
      .catch(err => console.error('Erreur lors du chargement des utilisateurs', err));
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');  // Récupérer le jeton JWT
    try {
      await axios.post('http://127.0.0.1:5000/users', {
        email,
        firstName,
        lastName,
        role,
        password
      }, {
        headers: {
          Authorization: `Bearer ${token}`  // Ajouter le jeton aux en-têtes
        }
      });
      setMessage('Utilisateur ajouté avec succès!');
      // Optionnel: rafraîchir la liste des utilisateurs
      const response = await axios.get('http://127.0.0.1:5000/users', {
        headers: {
          Authorization: `Bearer ${token}`  // Ajouter le jeton aux en-têtes
        }
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Une erreur s\'est produite.');
      }
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <form onSubmit={handleAddUser}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="visiteur">Visiteur</option>
            <option value="admin">Admin</option>
            {/* Ajouter d'autres rôles si nécessaire */}
          </select>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Add User</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Users List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.email} - {user.first_name} {user.last_name} ({user.role})</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
