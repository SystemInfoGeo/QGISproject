import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AdminRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('visiteur');  // Par défaut 'visiteur'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/register`, {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        role  // Envoyer le rôle sélectionné
      });
      router.push('/admin/users');  // Rediriger vers une page de gestion des utilisateurs
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Créer un Utilisateur</h1>
      <form onSubmit={handleSubmit}>
        <label>Nom:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <label>Prénom:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Mot de passe:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Confirmer le mot de passe:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <label>Numéro de téléphone:</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <label>Rôle:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="visiteur">Visiteur</option>
          <option value="agent">Agent de collecte</option>
          <option value="administrateur">Administrateur</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Création en cours...' : "Créer l'utilisateur"}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default AdminRegister;
