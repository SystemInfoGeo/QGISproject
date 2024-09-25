import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      localStorage.setItem('token', response.data.token);  // Stockage du token après une connexion réussie
      router.push('/collect');  // Redirection vers la page de collecte
    } catch (error) {
      // Gérer les erreurs de connexion ici
      if (error.response && error.response.status === 401) {
        setError('Identifiants incorrects. Veuillez réessayer.');
      } else {
        setError('Erreur de connexion. Veuillez vérifier vos informations.');
      }
      console.error('Erreur de connexion:', error);  // Afficher l'erreur dans la console pour déboguer
    }
  };

  return (
    <div>
      <h1>Se connecter</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Se connecter</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Affichage des messages d'erreur */}
      </form>
    </div>
  );
};

export default Login;
