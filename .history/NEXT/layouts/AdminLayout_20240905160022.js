import AdminNavbar from '../components/AdminNavbar';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div>
      <AdminNavbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
