import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa'; // Ajout d'icônes

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fonction pour récupérer les informations de profil de l'utilisateur
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token'); // Récupérer le token JWT
      if (!token) {
        setError('Aucun token trouvé. Veuillez vous connecter.');
        setLoading(false);
        window.location.href = '/login';
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:5000/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,  // Ajouter le token dans les en-têtes
          },
        });
        setUser(response.data);  // Stocker les données de l'utilisateur
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération du profil utilisateur :', err.response || err);
        setError('Erreur lors du chargement des informations utilisateur.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');  // Supprimer le token du localStorage
    window.location.href = '/login';   // Rediriger vers la page de connexion
  };

  // Si le profil est en cours de chargement, afficher un indicateur de chargement
  if (loading) {
    return <div className="text-center mt-5">Chargement...</div>;
  }

  // Si une erreur survient, afficher le message d'erreur
  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  // Afficher les informations de l'utilisateur s'il existe
  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ width: '30rem', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4" style={{ fontSize: '2rem' }}>
            Profil Utilisateur
          </Card.Title>
          {user && (
            <>
              <Row className="mb-3">
                <Col xs={2}>
                  <FaEnvelope size={20} />
                </Col>
                <Col>
                  <strong>Email :</strong> {user.email}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={2}>
                  <FaUser size={20} />
                </Col>
                <Col>
                  <strong>Prénom :</strong> {user.first_name}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={2}>
                  <FaUser size={20} />
                </Col>
                <Col>
                  <strong>Nom :</strong> {user.last_name}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={2}>
                  <FaPhone size={20} />
                </Col>
                <Col>
                  <strong>Numéro de téléphone :</strong> {user.phone_number}
                </Col>
              </Row>
              <div className="text-center">
                <Button variant="danger" onClick={handleLogout} className="mt-3">
                  Se déconnecter
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProfile;
