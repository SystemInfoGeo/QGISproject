import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import AdminLayout from '../../../layouts/AdminLayout';

export default function EditTrashBin() {
  const router = useRouter();
  const { id } = router.query;
  const [trashBin, setTrashBin] = useState({
    name: '',
    latitude: '',
    longitude: '',
    status: 'vide',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchTrashBin = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/get-trash-bin/${id}`);
          setTrashBin(res.data);
        } catch (error) {
          console.error('Erreur lors de la récupération du point de collecte', error);
        }
      };
      fetchTrashBin();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/update-trash-bin/${id}`, trashBin);
      setMessage('Point de collecte mis à jour avec succès!');
    } catch (error) {
      setMessage('Erreur lors de la mise à jour du point de collecte');
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <div className="container mt-5">
        <h1>Modifier le point de collecte</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              className="form-control"
              value={trashBin.name}
              onChange={(e) => setTrashBin({ ...trashBin, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Latitude</label>
            <input
              type="text"
              className="form-control"
              value={trashBin.latitude}
              onChange={(e) => setTrashBin({ ...trashBin, latitude: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Longitude</label>
            <input
              type="text"
              className="form-control"
              value={trashBin.longitude}
              onChange={(e) => setTrashBin({ ...trashBin, longitude: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              className="form-control"
              value={trashBin.status}
              onChange={(e) => setTrashBin({ ...trashBin, status: e.target.value })}
            >
              <option value="vide">Vide</option>
              <option value="plein">Plein</option>
              <option value="depart">Point de départ</option>
              <option value="decharge">Point de décharge</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Mettre à jour</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </AdminLayout>
  );
}

