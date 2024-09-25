import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const AdminNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">Administration</Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="/">Retour sur le site</Nav.Link>
          <NavDropdown title="GreatAdmin" id="basic-nav-dropdown">
            <NavDropdown.Item href="/admin/profile">Profil</NavDropdown.Item>
            <NavDropdown.Item href="/admin/settings">Paramètres</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/logout">Déconnexion</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
