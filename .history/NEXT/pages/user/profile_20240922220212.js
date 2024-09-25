import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import Navbar from '../../components/Navbar'; // Assurez-vous que le chemin est correct

const UserProfile = () => {
  const [user, setUser] = useState(null); // Stocke les informations de l'utilisateur
  const [loading, setLoading] = useState(true); // Gère l'état de chargement du profil
  const [error, setError] = useState(''); // Gère les erreurs

  // Fonction pour récupérer le profil utilisateur
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      console.log('Token récupéré :', token);

      if (!token) {
        setError('Aucun token trouvé. Veuillez vous connecter.');
        setLoading(false);
        window.location.href = '/login';
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:5000/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        console.log('Réponse du serveur :', response);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des informations utilisateur :', err.response || err);
        setError('Erreur lors du chargement des informations utilisateur.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Fonction de déconnexion
const handleLogout = () => {
  localStorage.removeItem('access_token'); // Utilisez le bon nom de token
  console.log('Token supprimé');
  // Utilisez router.push si possible
  window.location.href = '/login'; // Ou utilisez router.push('/login');
};

  // Si le profil est en cours de chargement, afficher "Chargement..."
  if (loading) {
    return <div className="text-center mt-5">Chargement...</div>;
  }

  // Si une erreur survient, l'afficher
  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  return (
    <>
      <Navbar /> {/* Ajoutez le composant Navbar ici */}
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
    </>
  );
};

export default UserProfile;
