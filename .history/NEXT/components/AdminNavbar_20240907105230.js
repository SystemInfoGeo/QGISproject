import styles from './AdminNavbar.module.css'; // Import du module CSS
import { Navbar, Nav, Container } from 'react-bootstrap';

const AdminNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container fluid>
        {/* Alignement de "Administration" à gauche */}
        <Navbar.Brand href="/" className={styles.navbarBrand}>Administration</Navbar.Brand>

        {/* Alignement de "Retour sur le site" et "Profil" à droite */}
        <Nav className={styles.navbarNav}>
          <Nav.Link href="/">Retour sur le site</Nav.Link>
          <Nav.Link href="/admin/profile">Profil</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
