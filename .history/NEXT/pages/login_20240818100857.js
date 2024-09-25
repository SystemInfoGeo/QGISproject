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

    // Vérifier les données avant l'envoi
    console.log('Email:', email, 'Password:', password);

    try {
      // Envoyer la requête au serveur Flask
      const response = await axios.post('http://localhost:5000/login', { email, password });
      
      // Stocker le token de session dans le localStorage
      localStorage.setItem('token', response.data.token);
      
      // Rediriger vers la page de collecte après une connexion réussie
      router.push('/collect');
    } catch (error) {
      // Vérification et gestion des erreurs
      if (error.response) {
        console.error('Erreur complète:', error); // Affiche l'erreur complète dans la console
        console.error('Détails de l\'erreur:', error.response.data); // Affiche les détails de l'erreur

        // Gestion des erreurs spécifiques en fonction du statut
        if (error.response.status === 401) {
          setError('Identifiants incorrects. Veuillez réessayer.');
        } else {
          setError('Erreur de connexion. Veuillez vérifier vos informations.');
        }
      } else {
        // Erreur générique si aucune réponse spécifique n'est reçue
        setError('Erreur de connexion. Veuillez vérifier votre connexion réseau.');
      }
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
