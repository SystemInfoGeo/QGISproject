import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Indicateur de chargement

    // Vérifiez si les mots de passe correspondent
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    // Validation basique du format de l'email et du numéro de téléphone
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Adresse email invalide.');
      setLoading(false);
      return;
    }

    const phonePattern = /^[0-9]{10,15}$/;
    if (!phonePattern.test(phoneNumber)) {
      setError('Numéro de téléphone invalide.');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        email,
        password,
        confirm_password: confirmPassword, 
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber
      });
      router.push('/login');
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false); // Retirer l'indicateur de chargement
    }
  };

  return (
    <div>
      <h1>S'inscrire</h1>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Inscription en cours...' : "S'inscrire"}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Signup;
