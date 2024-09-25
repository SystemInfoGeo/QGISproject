import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const NavbarTop = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand href="/">Administration</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/">Retour sur le site</Nav.Link>
            <NavDropdown title="GreatAdmin" id="basic-nav-dropdown">
              <NavDropdown.Item href="/admin/profile">Profil</NavDropdown.Item>
              <NavDropdown.Item href="/admin/settings">Paramètres</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/logout">Déconnexion</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarTop;
