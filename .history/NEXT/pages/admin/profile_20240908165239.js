import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Row, Col } from 'react-bootstrap';
import AdminLayout from '../../layouts/AdminLayout'; // Assurez-vous que ce chemin est correct

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fonction pour récupérer les informations de profil de l'administrateur
  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem('token');  // Récupérer le token depuis le localStorage

      if (!token) {
        setError('Aucun token trouvé. Veuillez vous connecter.');
        setLoading(false);
        return; // Arrêter la fonction si aucun token n'est trouvé
      }

      console.log("Token récupéré :", token);  // Log pour vérifier si le token est bien récupéré

      try {
        const response = await axios.get('http://127.0.0.1:5000/admin/profile', {
          headers: {
            Authorization: `Bearer ${token}`,  // Ajouter le token d'authentification
          },
        });
        setAdmin(response.data);  // Stocker les informations récupérées
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération du profil admin:', err.response || err);
        setError('Erreur lors du chargement des informations administrateur.');
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');  // Supprimer le token du localStorage
    console.log('Token supprimé');
    window.location.href = '/login';  // Rediriger vers la page de connexion
  };

  // Si le profil est en cours de chargement, afficher "Chargement..."
  if (loading) {
    return <div className="text-center mt-5">Chargement...</div>;
  }

  // Si une erreur survient, l'afficher
  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  // Afficher les informations du profil si elles sont disponibles
  return (
    <AdminLayout>
      <Container className="mt-5">
        <h1>Profil Administrateur</h1>
        {admin && (
          <Row>
            <Col md={6}>
              <p><strong>Email :</strong> {admin.email}</p>
              <p><strong>Prénom :</strong> {admin.first_name}</p>
              <p><strong>Nom :</strong> {admin.last_name}</p>
              <p><strong>Numéro de téléphone :</strong> {admin.phone_number}</p>
              <p><strong>Rôle :</strong> {admin.role}</p>
              <Button variant="danger" onClick={handleLogout}>Se déconnecter</Button>
            </Col>
          </Row>
        )}
      </Container>
    </AdminLayout>
  );
};

export default AdminProfile;
