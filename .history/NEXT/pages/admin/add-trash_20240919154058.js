import { useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import Map from '../../components/Map';

export default function AddTrashBin() {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState('vide');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post('http://localhost:5000/add-trash-bin', {
        name,
        latitude,
        longitude,
        status,
      });
      
      // Afficher le message de succès
      setMessage('Point de collecte ajouté avec succès!');

      // Réinitialiser les champs du formulaire
      setName('');
      setLatitude('');
      setLongitude('');
      setStatus('vide');

      // Masquer le message après 3 secondes
      setTimeout(() => {
        setMessage('');
      }, 3000);  // 3000 millisecondes = 3 secondes

    } catch (error) {
      setMessage('Erreur lors de l\'ajout du point de collecte');
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <div className="container mt-5">
        <h1>Ajouter une nouvelle point de collecte</h1>
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
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Ajouter</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </AdminLayout>
  );
}
