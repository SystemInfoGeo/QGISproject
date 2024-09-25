import { Navbar, Nav, Container } from 'react-bootstrap';

const AdminNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        {/* Alignement de "Administration" à gauche */}
        <Navbar.Brand href="/" className="me-auto">Administration</Navbar.Brand>

        {/* Alignement de "Retour sur le site" et "Profil" à droite */}
        <Nav className="ms-auto"> {/* ms-auto pour aligner à droite */}
          <Nav.Link href="/">Retour sur le site</Nav.Link>
          <Nav.Link href="/admin/profile">Profil</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
