import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa'; // Ajout d'icônes

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://127.0.0.1:5000/user/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
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
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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

