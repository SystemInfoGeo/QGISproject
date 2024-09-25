import { useState } from 'react';
import axios from 'axios';

export default function AddTrashBin() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState('vide');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post('http://localhost:5000/add-trash-bin', {
        latitude,
        longitude,
        status,
      });
      setMessage('Poubelle ajoutée avec succès!');
    } catch (error) {
      setMessage('Erreur lors de l\'ajout de la poubelle');
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Ajouter une nouvelle poubelle</h1>
      <form onSubmit={handleSubmit}>
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
  );
}
