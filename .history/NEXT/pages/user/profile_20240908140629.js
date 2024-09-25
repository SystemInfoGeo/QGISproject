import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Row, Col } from 'react-bootstrap';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token'); // Récupérer le token de l'utilisateur
      try {
        const response = await axios.get(`http://127.0.0.1:5000/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des informations utilisateur.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprimer le token pour déconnecter l'utilisateur
    window.location.href = '/login';  // Rediriger l'utilisateur vers la page de connexion
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <h1>Profil Utilisateur</h1>
      {user && (
        <Row>
          <Col md={6}>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Prénom :</strong> {user.first_name}</p>
            <p><strong>Nom :</strong> {user.last_name}</p>
            <p><strong>Numéro de téléphone :</strong> {user.phone_number}</p>
            <Button variant="danger" onClick={handleLogout}>Se déconnecter</Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default UserProfile;
