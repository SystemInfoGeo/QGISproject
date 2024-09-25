// pages/report.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';

// Charger dynamiquement la carte Leaflet uniquement côté client
const Map = dynamic(() => import('../../components/Map'), { ssr: false });

const ReportForm = () => {
  const [name, setName] = useState('');
  const [lat, setLat] = useState(''); // Gérer la latitude
  const [lng, setLng] = useState(''); // Gérer la longitude
  const [status, setStatus] = useState(''); // Gérer le statut
  const [comments, setComments] = useState(''); // Gérer les commentaires
  const router = useRouter();

  // Fonction déclenchée lors d'un clic sur la carte pour mettre à jour lat/lng
  const handleMapClick = ({ lat, lng }) => {
    setLat(lat); // Mettre à jour la latitude
    setLng(lng); // Mettre à jour la longitude
  };

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Vérifier que les coordonnées sont sélectionnées
    if (!lat || !lng) {
      alert('Veuillez cliquer sur la carte pour sélectionner une position.');
      return;
    }
     // Vérification des données avant envoi
    console.log({ lat, lng, status, comments });
    // Envoi de la requête POST vers l'API Flask
    const response = await fetch('http://localhost:5000/report-bin', { // Utilisez l'URL correcte de votre API Flask
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lat, lng, status, comments }),
    });

    // Gestion des réponses
    if (response.ok) {
      alert('Votre signalement a été reçu !');
      router.push('/'); // Redirection après succès
    } else {
      alert('Erreur lors de l\'envoi du formulaire.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Signaler une Poubelle</h2>
      {/* Utilisation de la carte avec gestion du clic */}
      <Map onClick={handleMapClick} />
      <form onSubmit={handleSubmit}>
      <div className="form-group">
          <label htmlFor="name">Nom :</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)} // Mise à jour de l'état pour le nom
            required // Champ obligatoire
          />
        </div>
        <div className="form-group">
          <label htmlFor="lat">Latitude :</label>
          <input
            type="text"
            id="lat"
            className="form-control"
            value={lat}
            readOnly // Latitude en lecture seule
          />
        </div>
        <div className="form-group">
          <label htmlFor="lng">Longitude :</label>
          <input
            type="text"
            id="lng"
            className="form-control"
            value={lng}
            readOnly // Longitude en lecture seule
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
          <label htmlFor="comments">Commentaires (optionnel) :</label>
          <textarea
            id="comments"
            className="form-control"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Ajoutez des détails si nécessaire (facultatif)"
          />
        </div>
        <button type="submit" className="btn btn-primary">Envoyer</button>
      </form>
    </div>
  );
};

export default ReportForm;
