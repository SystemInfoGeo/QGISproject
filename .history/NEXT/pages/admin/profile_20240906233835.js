import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout'; // Assurez-vous que le chemin est correct
import { Button, Container, Row, Col } from 'react-bootstrap';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem('token');
    console.log("Token récupéré :", token);  // Log pour vérifier si le token est bien récupéré

      try {
        const response = await axios.get(`http://127.0.0.1:5000/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ajoute le token d'authentification si tu utilises JWT
          },
        });
        setAdmin(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des informations administrateur.');
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);


  const handleLogout = () => {
    // Action de déconnexion (supprimer le token ou rediriger vers la page de connexion)
    localStorage.removeItem('token'); // Suppression du token JWT
    window.location.href = '/login';  // Redirection vers la page de connexion
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <AdminLayout>
      <Container>
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
