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
    axios.get('/check_login').then(response => {
      if (!response.data.logged_in) {
        router.push('/login');
      }
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
      .catch(error => console.error('Erreur lors du chargement des utilisateurs', error));
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');  // Récupérer le jeton JWT
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

      setMessage('Utilisateur ajouté avec succès');
      
    } catch (error) {
      setError('Erreur lors de l\'ajout de l\'utilisateur');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Ajouter un utilisateur</h1>
      {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleAddUser}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <input type="text" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="visiteur">Visiteur</option>
          <option value="admin">Administrateur</option>
        </select>
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Ajouter</button>
      </form>

      <h2>Liste des utilisateurs</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.first_name} {user.last_name} - {user.email} ({user.role})</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;


