import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const AdminNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">Administration</Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="/">Retour sur le site</Nav.Link>
          <Nav.Link href="/admin/profile">Profil</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
