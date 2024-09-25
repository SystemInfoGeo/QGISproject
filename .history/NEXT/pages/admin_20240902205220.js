import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AdminPage = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('visiteur');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/users', {
        email,
        firstName,
        lastName,
        role,
        password
      });
      setMessage('Utilisateur ajouté avec succès');
    } catch (error) {
      setError('Erreur lors de l\'ajout de l\'utilisateur');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1>Ajouter un utilisateur</h1>
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleAddUser}>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          <input type="text" placeholder="Prénom" onChange={(e) => setFirstName(e.target.value)} required />
          <input type="text" placeholder="Nom" onChange={(e) => setLastName(e.target.value)} required />
          <select onChange={(e) => setRole(e.target.value)} required>
            <option value="visiteur">Visiteur</option>
            <option value="admin">Administrateur</option>
          </select>
          <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Ajouter</button>
        </form>
      </div>
    </>
  );
};

export default AdminPage;
