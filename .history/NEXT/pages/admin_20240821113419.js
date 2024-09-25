import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        password: '',
    });

    useEffect(() => {
        // Vérifiez que l'utilisateur est bien connecté et a le rôle d'admin
        axios.get('http://localhost:5000/admin/data', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(response => {
            setUsers(response.data.users);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        });
    }, []);

    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/admin', newUser, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(response => {
            console.log(response.data.message);
            // Rechargez la liste des utilisateurs après l'inscription d'un nouvel agent
            setUsers([...users, newUser]);
        })
        .catch(error => {
            console.error('Erreur lors de l\'inscription de l\'agent:', error);
        });
    };

    return (
        <div>
            <h1>Tableau de Bord Administrateur</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="text" name="first_name" placeholder="Prénom" onChange={handleChange} />
                <input type="text" name="last_name" placeholder="Nom" onChange={handleChange} />
                <input type="text" name="phone_number" placeholder="Téléphone" onChange={handleChange} />
                <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} />
                <button type="submit">Inscrire l'Agent</button>
            </form>

            <h2>Liste des Utilisateurs</h2>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>{user.first_name} {user.last_name} - {user.email}</li>
                ))}
            </ul>
        </div>
    );
}
