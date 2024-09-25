import { useEffect } from 'react';
import io from 'socket.io-client';

const Signalement = () => {
  useEffect(() => {
    const socket = io('http://localhost:5000/admin'); // Se connecter au namespace de l'administrateur

    socket.on('new_signalement', (data) => {
      alert(`Nouveau signalement pour l'administrateur : Latitude ${data.lat}, Longitude ${data.lng}, Statut : ${data.status}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Tableau de bord de l'administrateur</h2>
    </div>
  );
};

export default Signalement;
