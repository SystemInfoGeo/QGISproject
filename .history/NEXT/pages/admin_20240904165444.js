import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');
      
      if (!token) {
        setError('Vous devez être connecté pour accéder à cette page.');
        router.push('/login'); // Redirection vers la page de connexion
        return;
      }

      if (userRole !== 'admin') {
        setError("Accès refusé. Vous n'avez pas les droits d'administration.");
        router.push('/'); // Redirection vers la page d'accueil ou autre page
        return;
      }

      try {
        // Charger les données d'utilisateurs si l'utilisateur est un admin
        const response = await axios.get('http://127.0.0.1:5000/get_users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        setError('Erreur lors du chargement des données.');
      }
    };

    checkAuth();
  }, [router]);

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
          <label>Numéro de téléphone:</label>  {/* Nouveau champ pour le numéro de téléphone */}
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
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
          <li key={user.id}>{user.email} - {user.first_name} {user.last_name} - {user.phone_number} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
