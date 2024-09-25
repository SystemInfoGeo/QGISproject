import { useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://127.0.0.1:5000/profile/change-password', { new_password: newPassword }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage('Mot de passe mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe');
    }
  };

  return (
    <AdminLayout>
      <h1>Changer le mot de passe</h1>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>Nouveau mot de passe</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button type="submit">Changer le mot de passe</button>
        {message && <p>{message}</p>}
      </form>
    </AdminLayout>
  );
};

export default ChangePassword;
