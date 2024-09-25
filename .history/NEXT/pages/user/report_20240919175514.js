// pages/report.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReportForm = () => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [status, setStatus] = useState('');
  const [comments, setComments] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('/api/report-bin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lat, lng, status, comments }),
    });

    if (response.ok) {
      alert('Votre signalement a été reçu !');
      router.push('/'); // Redirige vers la page d'accueil ou une autre page après soumission
    } else {
      alert('Erreur lors de l\'envoi du formulaire.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Signaler une Poubelle</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="lat">Latitude:</label>
          <input
            type="text"
            id="lat"
            className="form-control"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lng">Longitude:</label>
          <input
            type="text"
            id="lng"
            className="form-control"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Status de la Poubelle:</label>
          <div className="form-check">
            <input
              type="radio"
              id="full"
              name="status"
              value="full"
              className="form-check-input"
              onChange={(e) => setStatus(e.target.value)}
              required
            />
            <label htmlFor="full" className="form-check-label">Pleine</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              id="empty"
              name="status"
              value="empty"
              className="form-check-input"
              onChange={(e) => setStatus(e.target.value)}
              required
            />
            <label htmlFor="empty" className="form-check-label">Vide</label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="comments">Commentaires (optionnel):</label>
          <textarea
            id="comments"
            className="form-control"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Soumettre</button>
      </form>
    </div>
  );
};

export default ReportForm;
