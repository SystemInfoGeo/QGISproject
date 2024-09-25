import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import Navbar from '../../components/Navbar'; // Assurez-vous que ce composant Navbar existe bien

const UserProfile = () => {
  const [user, setUser] = useState(null); // Etat pour stocker les données utilisateur
  const [loading, setLoading] = useState(true); // Etat pour gérer le chargement
  const [error, setError] = useState(''); // Etat pour stocker les erreurs

  // useEffect pour charger les informations utilisateur au montage du composant
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token'); // Récupérer le token d'authentification
      if (!token) {
        setError('Aucun token trouvé. Veuillez vous connecter.'); // Erreur si le token est absent
        setLoading(false);
        window.location.href = '/login'; // Redirection vers la page de login
        return;
      }

      try {
        // Appel API pour récupérer le profil utilisateur
        const response = await axios.get('http://127.0.0.1:5000/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Inclure le token dans l'entête de la requête
            'Content-Type': 'application/json',
          },
        });
        setUser(response.data); // Stocker les données utilisateur dans l'état
        setLoading(false); // Fin du chargement
      } catch (err) {
        console.error('Erreur lors du chargement des informations utilisateur :', err.response || err);
        setError('Erreur lors du chargement des informations utilisateur.'); // Message d'erreur
        setLoading(false);
      }
    };

    fetchUserProfile(); // Appeler la fonction lors du montage
  }, []); // Tableau de dépendances vide signifie que cela ne s'exécute qu'une fois au montage

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/logout', {}, { withCredentials: true });
      if (response.status === 200) {
        console.log(response.data.message); // Message de succès lors de la déconnexion
        localStorage.removeItem('token'); // Supprimer le token de localStorage
        window.location.href = '/login'; // Redirection vers la page de login
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  // Affichage en cas de chargement
  if (loading) {
    return <div className="text-center mt-5">Chargement...</div>;
  }

  // Affichage en cas d'erreur
  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  return (
    <>
      <Navbar /> {/* Inclusion du composant Navbar */}
      <Container className="d-flex justify-content-center mt-5">
        <Card style={{ width: '30rem', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <Card.Body>
            <Card.Title className="text-center mb-4" style={{ fontSize: '2rem' }}>
              Profil Utilisateur
            </Card.Title>
            {/* Affichage des informations utilisateur */}
            {user && (
              <>
                <Row className="mb-3">
                  <Col xs={2}><FaEnvelope size={20} /></Col>
                  <Col><strong>Email :</strong> {user.email}</Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={2}><FaUser size={20} /></Col>
                  <Col><strong>Prénom :</strong> {user.first_name}</Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={2}><FaUser size={20} /></Col>
                  <Col><strong>Nom :</strong> {user.last_name}</Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={2}><FaPhone size={20} /></Col>
                  <Col><strong>Numéro de téléphone :</strong> {user.phone_number}</Col>
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
