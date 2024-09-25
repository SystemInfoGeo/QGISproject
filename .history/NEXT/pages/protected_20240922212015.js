// pages/protected.js
import useAuth from '../hooks/useAuth'; // Importer le hook useAuth
import { Spinner } from 'react-bootstrap'; // Importer Spinner si vous l'utilisez pour le chargement

const ProtectedPage = () => {
  const { authenticated, loading } = useAuth();

  // Afficher un spinner pendant la vérification de l'authentification
  if (loading) {
    return <Spinner animation="border" role="status">Chargement...</Spinner>;
  }

  // Si l'utilisateur n'est pas authentifié, il sera redirigé automatiquement par le hook
  if (!authenticated) {
    return null; // Ou un message de redirection si nécessaire
  }

  // Afficher le contenu protégé si l'utilisateur est authentifié
  return <div>Contenu protégé</div>;
};

export default ProtectedPage;
