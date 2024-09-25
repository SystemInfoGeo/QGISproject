/*import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Ajouté pour gérer le chargement
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Indicateur de chargement

    // Validation basique
    if (!email || !password) {
      setError('Tous les champs sont requis.');
      setLoading(false);
      return;
    }

    try {
      // Envoyer la requête au serveur Flask
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, { email, password });
      
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
    } finally {
      setLoading(false); // Retirer l'indicateur de chargement
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
        <button type="submit" disabled={loading}>
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Affichage des messages d'erreur */}
      </form>
    </div>
  );
};

export default Login;*/
