import { Nav } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <div className="sidebar bg-dark" style={{ height: '100vh', width: '250px', position: 'fixed' }}>
      <Nav className="flex-column p-3 text-white">
        <Nav.Link href="/admin/dashboard" className="text-white">Tableau de bord</Nav.Link>
        <Nav.Link href="/admin/users" className="text-white">Utilisateurs</Nav.Link>
        <Nav.Link href="/admin/messages" className="text-white">Messages</Nav.Link>
        <Nav.Link href="/admin/comments" className="text-white">Commentaires</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
