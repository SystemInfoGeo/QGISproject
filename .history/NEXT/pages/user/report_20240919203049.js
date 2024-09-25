// pages/report.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Map from '../../components/Map';

const ReportForm = () => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [status, setStatus] = useState('');
  const [comments, setComments] = useState('');
  const router = useRouter();

  const handleMapClick = ({ lat, lng }) => {
    setLat(lat); // Mettre à jour la latitude
    setLng(lng); // Mettre à jour la longitude
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Vérifier si les coordonnées sont définies avant soumission
    if (!lat || !lng) {
      alert('Veuillez cliquer sur la carte pour sélectionner une position.');
      return;
    }

    const response = await fetch('/api/report-bin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lat, lng, status, comments }),
    });

    if (response.ok) {
      alert('Votre signalement a été reçu !');
      router.push('/'); // Rediriger vers la page d'accueil ou une autre page après soumission
    } else {
      alert('Erreur lors de l\'envoi du formulaire.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Signaler une Poubelle</h2>
      <Map onClick={handleMapClick} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="lat">Latitude :</label>
          <input
            type="text"
            id="lat"
            className="form-control"
            value={lat}
            readOnly // Champ en lecture seule pour la latitude
          />
        </div>
        <div className="form-group">
          <label htmlFor="lng">Longitude :</label>
          <input
            type="text"
            id="lng"
            className="form-control"
            value={lng}
            readOnly // Champ en lecture seule pour la longitude
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Statut :</label>
          <select
            id="status"
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Choisir...</option>
            <option value="plein">Plein</option>
            <option value="vide">Vide</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="comments">Commentaires :</label>
          <textarea
            id="comments"
            className="form-control"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Envoyer</button>
      </form>
    </div>
  );
};

export default ReportForm;
