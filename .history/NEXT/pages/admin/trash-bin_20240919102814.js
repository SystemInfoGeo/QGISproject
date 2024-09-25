import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

export default function ManageTrashBins() {
  const [trashBins, setTrashBins] = useState([]);
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState('vide');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Définition de la fonction fetchTrashBins
  const fetchTrashBins = async () => {
    try {
      const res = await axios.get('http://localhost:5000/get_all-trash-bins');
      setTrashBins(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des points de collecte', error);
    }
  };

  useEffect(() => {
    // Appel à fetchTrashBins lorsque le composant est monté
    fetchTrashBins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Mise à jour du point de collecte
      try {
        await axios.put(`http://localhost:5000/update-trash-bin/${editingId}`, {
          name,
          latitude,
          longitude,
          status,
        });
        setMessage('Point de collecte mis à jour avec succès!');
        setIsEditing(false);
        setEditingId(null);
      } catch (error) {
        setMessage('Erreur lors de la mise à jour du point de collecte');
        console.error(error);
      }
    } else {
      // Ajout d'un nouveau point de collecte
      try {
        await axios.post('http://localhost:5000/add-trash-bin', {
          name,
          latitude,
          longitude,
          status,
        });
        setMessage('Point de collecte ajouté avec succès!');
      } catch (error) {
        setMessage('Erreur lors de l\'ajout du point de collecte');
        console.error(error);
      }
    }

    // Réinitialiser les champs du formulaire
    setName('');
    setLatitude('');
    setLongitude('');
    setStatus('vide');

    // Rafraîchir la liste des points de collecte
    fetchTrashBins();  // Appel à la fonction pour actualiser la liste
    setTimeout(() => setMessage(''), 3000);  // Effacer le message après 3 secondes
  };

  const handleEdit = (bin) => {
    // Remplir le formulaire avec les données existantes pour modification
    setName(bin.name);
    setLatitude(bin.latitude);
    setLongitude(bin.longitude);
    setStatus(bin.status);
    setIsEditing(true);
    setEditingId(bin.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-trash-bin/${id}`);
      setMessage('Point de collecte supprimé avec succès!');
      setTrashBins(trashBins.filter(bin => bin.id !== id));
    } catch (error) {
      setMessage('Erreur lors de la suppression du point de collecte');
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <div className="container mt-5">
        <h1>Gestion des points de collecte</h1>

        {message && <div className="alert alert-info">{message}</div>}

        {/* Formulaire pour ajouter ou modifier un point de collecte */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Latitude</label>
            <input
              type="text"
              className="form-control"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Longitude</label>
            <input
              type="text"
              className="form-control"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="vide">Vide</option>
              <option value="plein">Plein</option>
              <option value="depart">Point de départ</option>
              <option value="decharge">Point de décharge</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Modifier le point' : 'Ajouter le point'}
          </button>
        </form>

        {/* Liste des points de collecte */}
        <h2 className="mt-4">Liste des points de collecte</h2>
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
                    className="btn btn-warning me-2"
                    onClick={() => handleEdit(bin)}
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
