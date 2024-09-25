import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [role, setRole] = useState('visiteur');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Nouveau pour gérer l'édition
  const [editingUserId, setEditingUserId] = useState(null); // Nouveau pour stocker l'ID de l'utilisateur en cours d'édition
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté pour accéder à cette page.');
        return;
      }

      try {
        // Charger la liste des utilisateurs directement
        const usersResponse = await axios.get('http://127.0.0.1:5000/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(usersResponse.data);

      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs', err);
        setError('Erreur lors de la vérification de l\'utilisateur.');
      }
    };

    checkAuth();
  }, [router]);

  // Fonction pour ajouter ou modifier un utilisateur
  const handleAddOrEditUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Validation simple du numéro de téléphone
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Numéro de téléphone invalide. Veuillez entrer uniquement des chiffres.');
      return;
    }

    try {
      if (isEditing) {
        // Si nous sommes en mode édition
        await axios.put(`http://127.0.0.1:5000/users/${editingUserId}`, {
          email,
          first_name: firstName,
          last_name: lastName,
          role,
          phone_number: phoneNumber,
          password,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setMessage('Utilisateur modifié avec succès');
      } else {
        // Ajouter un nouvel utilisateur
        await axios.post('http://127.0.0.1:5000/users', {
          email,
          first_name: firstName,
          last_name: lastName,
          role,
          phone_number: phoneNumber,
          password,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setMessage('Utilisateur ajouté avec succès');
      }

      // Réinitialiser le formulaire
      setEmail('');
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setRole('visiteur');
      setPassword('');
      setIsEditing(false);
      setEditingUserId(null);

      // Recharger la liste des utilisateurs
      const usersResponse = await axios.get('http://127.0.0.1:5000/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(usersResponse.data);
    } catch (err) {
      console.error('Erreur lors de l\'ajout ou de la modification de l\'utilisateur', err);
      setError('Erreur lors de l\'ajout ou de la modification de l\'utilisateur');
    }
  };

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://127.0.0.1:5000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Utilisateur supprimé avec succès');

      // Recharger la liste des utilisateurs après la suppression
      const usersResponse = await axios.get('http://127.0.0.1:5000/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(usersResponse.data);
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur', err);
      setError('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  // Fonction pour éditer un utilisateur
  const handleEditUser = (user) => {
    setEmail(user.email);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setPhoneNumber(user.phone_number);
    setRole(user.role);
    setIsEditing(true);
    setEditingUserId(user.id);
  };

  return (
    <div>
      <h1>Page d'administration</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleAddOrEditUser}>
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
          <label>Numéro de téléphone:</label> 
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        </div>
        <div>
          <label>Rôle:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="superviseur">Superviseur</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label>Mot de passe:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">{isEditing ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</button>
      </form>

      <h2>Liste des utilisateurs</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.email} - {user.first_name} {user.last_name} - {user.phone_number} - {user.role}
            <button onClick={() => handleEditUser(user)}>Modifier</button>
            <button onClick={() => handleDeleteUser(user.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
