import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import Navbar from '../../components/Navbar';


const UserProfile = () => {
  const [user, setUser] = useState(null); // Stocke les informations de l'utilisateur
  const [loading, setLoading] = useState(true); // Gère l'état de chargement
  const [error, setError] = useState(''); // Gère les erreurs
  const [messages, setMessages] = useState([]); // Stocke les messages
  const [showMessages, setShowMessages] = useState(false); // Gère l'affichage des messages

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

  // Fonction pour récupérer les messages de l'utilisateur
  const fetchUserMessages = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('http://127.0.0.1:5000/user/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          email: user.email
        }
      });
      setMessages(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des messages :', err.response || err);
      setError('Erreur lors du chargement des messages.');
    }
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('Token supprimé');
    window.location.href = '/login';
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
              <Button 
                variant="primary" 
                onClick={() => {
                  setShowMessages(!showMessages);
                  if (!showMessages) fetchUserMessages(); // Charger les messages si on les affiche
                }} 
                className="mt-3"
              >
                {showMessages ? 'Masquer les Messages' : 'Afficher les Messages'}
              </Button>
              {showMessages && (
                <div className="mt-4">
                  <h4>Messages</h4>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Message</th>
                        <th>Date reçue</th>
                        <th>Réponse</th>
                        <th>Date de réponse</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map((message) => (
                        <tr key={message.id}>
                          <td>{message.id}</td>
                          <td>{message.message}</td>
                          <td>{new Date(message.date_received).toLocaleString()}</td>
                          <td>{message.reply || 'Pas encore de réponse'}</td>
                          <td>{message.reply_date ? new Date(message.reply_date).toLocaleString() : 'Pas encore de réponse'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
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
