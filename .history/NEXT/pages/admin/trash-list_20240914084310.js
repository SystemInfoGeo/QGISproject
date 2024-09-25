import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

export default function TrashList() {
  const [trashBins, setTrashBins] = useState([]);

  useEffect(() => {
    const fetchTrashBins = async () => {
      try {
        const res = await axios.get('http://localhost:5000/get-all-trash-bins');
        setTrashBins(res.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des points de collecte', error);
      }
    };

    fetchTrashBins();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-trash-bin/${id}`);
      setTrashBins(trashBins.filter(bin => bin.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du point de collecte', error);
    }
  };

  return (
    <AdminLayout>
      <div className="container mt-5">
        <h1>Liste des points de collecte</h1>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trashBins.map(bin => (
              <tr key={bin.id}>
                <td>{bin.name}</td>
                <td>{bin.latitude}</td>
                <td>{bin.longitude}</td>
                <td>{bin.status}</td>
                <td>
                  <button 
                    className="btn btn-warning mr-2"
                    onClick={() => window.location.href = `/admin/edit-trash/${bin.id}`}
                  >
                    Modifier
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(bin.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
