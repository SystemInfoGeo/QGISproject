import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Container, Row, Col } from 'react-bootstrap';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('visiteur');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    // Récupérer la liste des utilisateurs
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs', error);
        setError('Erreur lors du chargement des utilisateurs');
      }
    };

    fetchUsers();
  }, []);

  const handleAddOrEditUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      if (isEditing) {
         // Modifier un utilisateur
        await axios.put(`http://127.0.0.1:5000/users/${editingUserId}`, {
          email,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          role,
          password,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage('Utilisateur modifié avec succès');
      } else {
        // Ajouter un nouvel utilisateur
        await axios.post('http://127.0.0.1:5000/users', {
          email,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          role,
          password,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage('Utilisateur ajouté avec succès');
      }
      
    // Réinitialiser le formulaire
      setIsEditing(false);
      setEditingUserId(null);
      setEmail('');
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setRole('visiteur');
      setPassword('');

      // Recharger la liste des utilisateurs
      const response = await axios.get('http://127.0.0.1:5000/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Erreur lors de l\'ajout ou de la modification', err);
     // Différencier les erreurs entre ajout et modification
    if (isEditing) {
      setError('Erreur lors de la modification de l\'utilisateur');
    } else {
      setError('Erreur lors de l\'ajout de l\'utilisateur');
    }
  }
};

  const handleEditUser = (user) => {
    setEmail(user.email);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setPhoneNumber(user.phone_number);
    setRole(user.role);
    setIsEditing(true);
    setEditingUserId(user.id);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:5000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Utilisateur supprimé avec succès');
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Erreur lors de la suppression', err);
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <Container>
      <h1 className="mt-4">Page d'administration</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <Form onSubmit={handleAddOrEditUser}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formFirstName">
              <Form.Label>Prénom</Form.Label>
              <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formLastName">
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Numéro de téléphone</Form.Label>
              <Form.Control type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formRole">
              <Form.Label>Rôle</Form.Label>
              <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="superviseur">Visiteur</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit">{isEditing ? 'Modifier' : 'Ajouter'} l'utilisateur</Button>
      </Form>

      <h2>Liste des utilisateurs</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.phone_number}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditUser(user)}>Modifier</Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminPage;
