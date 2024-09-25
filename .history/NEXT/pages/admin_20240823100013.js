import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importez Bootstrap

export default function AdminDashboard() {
    // État pour stocker la liste des utilisateurs et les données du nouvel utilisateur
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        password: '',
    });

    // useEffect pour récupérer la liste des utilisateurs à partir du serveur lors du chargement de la page
    useEffect(() => {
        axios.get('http://localhost:5000/admin/data', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Authentification avec JWT
            },
        })
        .then(response => {
            setUsers(response.data.users); // Mettre à jour l'état avec les données des utilisateurs
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        });
    }, []); // [] signifie que ce code ne s'exécute qu'une fois après le premier rendu

    // Fonction pour mettre à jour l'état avec les valeurs du formulaire
    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    // Fonction pour gérer la soumission du formulaire d'inscription d'un nouvel utilisateur
    const handleSubmit = (e) => {
        e.preventDefault(); // Empêche le rechargement de la page à la soumission du formulaire
        
        // Vérifiez les valeurs des champs
        console.log("Données envoyées :", newUser);

        axios.post('http://localhost:5000/admin', newUser, {
            headers: {
                'Content-Type': 'application/json',  // Assurez-vous que le Content-Type est bien défini comme JSON
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Authentification avec JWT
            },
        })
        .then(response => {
            console.log(response.data.message); // Affiche un message de succès dans la console
            setUsers([...users, newUser]); // Mettre à jour la liste des utilisateurs avec le nouvel utilisateur ajouté
        })
        .catch(error => {
            console.error('Erreur lors de l\'inscription de l\'agent:', error);
        });
    };

    return (
        <div className="container">
            <h1>Tableau de Bord Administrateur</h1>
            {/* Formulaire pour inscrire un nouvel agent */}
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="text" name="first_name" placeholder="Prénom" onChange={handleChange} />
                <input type="text" name="last_name" placeholder="Nom" onChange={handleChange} />
                <input type="text" name="phone_number" placeholder="Téléphone" onChange={handleChange} />
                <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} />
                <button type="submit">Inscrire l'Agent</button>
            </form>

            {/* Liste des utilisateurs récupérés du serveur */}
            <h2>Liste des Utilisateurs</h2>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>{user.first_name} {user.last_name} - {user.email}</li>
                ))}
            </ul>
        </div>
    );
}
