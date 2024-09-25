import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import { Button, Container, Row, Col } from 'react-bootstrap';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem('token');
      console.log("Token récupéré :", token); // Vérifiez que le token est bien récupéré

      try {
        const response = await axios.get('http://127.0.0.1:5000/admin/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Assurez-vous que le token est correctement envoyé
          },
        });
        setAdmin(response.data);  // Si la réponse est bonne, enregistrez les données
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération du profil admin :", err); // Ajoutez des logs pour voir l'erreur côté client
        setError('Erreur lors du chargement des informations administrateur.');
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

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
